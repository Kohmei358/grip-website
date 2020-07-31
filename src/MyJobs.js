import React, { useState, useContext, useEffect } from 'react'
import FirebaseContext from './Firebase'
import AuthContext from './Firebase/AuthContext'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import JobCard from './JobCard'
import { CardColumns, Form, InputGroup, FormControl } from 'react-bootstrap'

function MyJobs() {
  const firebase = useContext(FirebaseContext)
  const authContext = useContext(AuthContext)
  const [url2, setUrl2] = useState(null)
  const [jobs, setJobs] = useState([]) //Data from DB
  const [display, setDisplay] = useState("Not Set") //JSX for List
  const [loading, setLoading] = useState(true); //Still loading array
  const handleClick = async(index) => { //To downolad resumes
    console.log(jobs[index], "Job Doccuement")
    const jobID = jobs[index].jobID
    console.log(jobID, "Job ID")
    let applicants = jobs[index].applicants
    let resumesRef = applicants.map((applicant) => {
      return applicant + jobID + '.pdf'
    })
    console.log(resumesRef, "Mapped pdf names")

    //Delay for UI demo
    let promise = new Promise((res, rej) => {
    setTimeout(() => res("Now it's done!"), 5000)
    });
    let result = await promise;

    try{
      const url = await firebase.storage.child(resumesRef[0]).getDownloadURL();
      //Temp -> Get url for PDF 1
      // `url` is the download URL for resume
      console.log(url, "Storage Url")
      setUrl2(url)
      // This can be downloaded directly:
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function (event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
    }
    catch(err){
      alert(err.message)
    }
  }

  useEffect(() => {
    //Only on mount
    firebase.db.collection('jobs').where("companyID", "==", authContext.user.uid)
      .get()
      .then(function (querySnapshot) { // search for jobs belonging to this company
        if (querySnapshot.docs.length === 0) {
          return (<h1> You have no currently posted jobs! </h1>)
        }
        querySnapshot.forEach(function (doc) {
          let job = doc.data()
          job.applicantNum = job.applicants.length //So this way the number of applicant is included
          job.jobID = doc.id //Similarly, include job's id
          setJobs(jobs.push(job)) //Add all jobs to array
        })
        setJobs(jobs)
        setLoading(false)
      }).catch(function (error) {
        console.log(error)
      })
  }, [])

  let localDisplay = "Loading..."
  if (!loading) {
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
          applicantNum={job.applicantNum}
          loading={(url2 != null)}
          url={url2}
        />
      );
    })
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
