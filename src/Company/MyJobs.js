import React, { useState, useContext, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import * as JSZip from 'jszip'
import * as JSZipUtils from 'jszip-utils'
import { saveAs } from 'save-as'
import JobCard from './JobCard'
import FirebaseContext from '../Firebase'
import AuthContext from '../Firebase/AuthContext'

function MyJobs() {
  const firebase = useContext(FirebaseContext)
  const authContext = useContext(AuthContext)
  const [downloaded, setDownloaded] = useState([])
  const [jobs, setJobs] = useState([]) //Data from DB
  const [loading, setLoading] = useState(true); //Still loading array

  const getDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy
  }

  const deepCopyArray = (arr) => {
    let arrayHolder = []
    arr.forEach((element, index) => {
      arrayHolder[index] = element
    })
    return arrayHolder
  }

  const updateUrls = async (resumeRefs) => {
    let urlsBuildingArray = []
    await Promise.all(resumeRefs.map(async (resumeRef, index) => {
      // await getUrl(resumeRef, index, urlsBuildingArray)
      let url = await firebase.storage.child(resumeRef).getDownloadURL()
      urlsBuildingArray[index] = url
    }))
    return urlsBuildingArray
  }

  const combineUrls = (urls1, urls2) => {
    let urlsBuilder = []
    urls1.forEach((url, index) => {
      urlsBuilder.push(urls1[index])
      urlsBuilder.push(urls2[index])
    })
    return urlsBuilder
  }

  const makeZip = (urls, studentNames, jobTitle, zipFileName, jobIndex) => {
    let zip = new JSZip();
    let count = 0;
    urls.forEach(function (url, index) { // build a zip file containing all resumes
      let filename = studentNames[index] + ' - ' + jobTitle + ".pdf";
      // loading a file and add it in a zip file
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err; // or handle the error
        }
        zip.file(filename, data, { binary: true });
        count++;
        if (count === urls.length) {
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, zipFileName)
            let downloadedBuilder = deepCopyArray(downloaded)
            downloadedBuilder[jobIndex] = true
            setDownloaded(downloadedBuilder)
          });
        }
      });
    });
  }

  const makeClZip = (urls, studentNames, jobTitle, zipFilename, jobIndex) => {
    let zip = new JSZip();
    let count = 0;
    console.log(urls)
    urls.forEach(function (url, index) { // build a zip file containing all resumes
      let filename
      if (index % 2 === 0) {
        filename = studentNames[Math.floor(index / 2)] + ' - Resume.pdf'
      } else {
        filename = studentNames[Math.floor(index / 2)] + ' - Cover Letter.pdf' // files: resume1, CL1, resume2, CL2...
      }
      // loading a file and add it in a zip file
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err; // or handle the error
        }
        zip.file(filename, data, { binary: true });
        count++;
        if (count === urls.length) {
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, zipFilename)
            let downloadedBuilder = deepCopyArray(downloaded)
            downloadedBuilder[jobIndex] = true
            setDownloaded(downloadedBuilder)
          });
        }
      });
    });
  }

  const handleSecondClick = (index) => { // set loading to false when the user clicks download the second time
    let downloadedBuilder = deepCopyArray(downloaded)
    downloadedBuilder[index] = false
    setDownloaded(downloadedBuilder)
  }

  const handleClick = async (index, jobTitle) => { //To downolad resumes
    const jobID = jobs[index].jobID
    const reqCoverLetter = jobs[index].reqCoverLetter
    let resumeRefs = []
    let clRefs = []
    let studentNames = []

    try {
      let querySnapshot = await firebase.db.collection('applications').where("jobID", "==", jobID).get()
      querySnapshot.forEach(function (doc) {
        let application = doc.data()
        resumeRefs.push(application.resumeName)
        studentNames.push(application.studentName)
        if (reqCoverLetter) clRefs.push(application.clName)
      })
    } catch (error) {
      alert(error)
    }

    //Delay for UI demo
    let promise = new Promise((res, rej) => {
      setTimeout(() => res("Now it's done!"), 1000)
    });
    await promise;

    try {
      let zipFilename = jobTitle + " Resumes.zip";
      let resumeUrls = await updateUrls(resumeRefs)
      let clUrls
      if (reqCoverLetter) {
        clUrls = await updateUrls(clRefs)
        let allUrls = combineUrls(resumeUrls, clUrls)
        makeClZip(allUrls, studentNames, jobTitle, zipFilename, index) // same as makeZip except for file naming 
      } else {
        makeZip(resumeUrls, studentNames, jobTitle, zipFilename, index)
      }

      firebase.db.collection('jobs').doc(jobID).update({
        newApplicants: 0
      }).catch(function(error){
        alert(error)
      })

      firebase.db.collection('applications').where("jobID", "==", jobID).get().then(function(querySnapshot){
        querySnapshot.forEach(function (doc) {
          doc.ref.update({
            downloaded: getDate()
          })
        })
      }).catch(function(error){
        alert(error)
      })

    }
    catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    //Only on mount
    async function loadJobs() { // async wihtin useEffect should be written like this according to warnings
      try {
        let querySnapshot = await firebase.db.collection('jobs').where("companyID", "==", authContext.user.uid).get()
        if (querySnapshot.docs.length === 0) {
          setJobs("No Jobs");
        } else {
          let jobsBuilder = []
          let downloadedBuilder = []
          querySnapshot.forEach(function (doc) {
            let job = doc.data()
            job.jobID = doc.id //Similarly, include job's id
            jobsBuilder.push(job) //Add all jobs to array
            downloadedBuilder.push(false)
          })
          setJobs(jobsBuilder)
          setDownloaded(downloadedBuilder)
        }
        setLoading(false)
      } catch (error) {
        alert(error)
      }
    }

    loadJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let localDisplay = "Loading..."
  if (!loading) {
    if (jobs === "No Jobs") {
      localDisplay = <h3> You have no posted jobs! </h3>
    } else {
      localDisplay = jobs.map((job, index) => { //Convert each element to JSX
        //convert all elements before reach render, this is only updates when show is changed
        return (
          <JobCard
            key={index}
            index={index}
            title={job.title}
            info={job.info}
            dl={job.deadline}
            handleClick={handleClick}
            handleSecondClick={handleSecondClick}
            newApplicants={job.newApplicants}
            allApplicants={job.allApplicants}
            loading={downloaded[index]}
          />
        );
      })
    }
  }

  return (
    <div style={{ background: "#e0e0e0" }}>
      <h1>A company only page that lists out jobs and allows resume download</h1>
      <Container fluid style={{ paddingTop: "2em" }}>
        <Row>
          <Col>
            <div style={{ marginLeft: "1em", borderRadius: "25px", background: "white", height: "40em" }}>
              <div style={{ margin: "2em", marginTop: "0em", background: "white", height: "40em" }}>
                Search Options Go Here
            </div>
            </div>
          </Col>
          <Col sm={7}>
            {localDisplay}
          </Col>
          <Col sm={3}>More Settings</Col>
        </Row>
      </Container>
    </div >
  )
}

export default MyJobs
