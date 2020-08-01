import React, { useState, useContext, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { CardColumns, Form, InputGroup, FormControl } from 'react-bootstrap'

import JobCard from './JobCard'
import FirebaseContext from '../Firebase'
import AuthContext from '../Firebase/AuthContext'

//
function Applications() {
    const firebase = useContext(FirebaseContext)
    const authContext = useContext(AuthContext)
    const [jobs, setJobs] = useState([]) //Data from DB
    const [display, setDisplay] = useState("Not Set") //JSX for List
    const [loading, setLoading] = useState(true); //Still loading array
    const handleClick = async(index) => { //To downolad resumes
        console.log(jobs[index])
        const jobID = jobs[index].jobID
        let applicants = jobs[index].applicants
        let resumesRef = applicants.map((applicant, index) => {
            return applicant + jobID + '.pdf'
        })
        let url = await firebase.storage.child(resumesRef[1]).getDownloadURL()
        // `url` is the download URL for resume

        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function (event) {
            var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
    }

    useEffect(() => {
        //Only on mount
        let jobIDs = []
        let studentRef = firebase.db.collection('students').doc(authContext.user.uid)
        studentRef.get().then(function (doc) {
            // console.log(doc.data().jobsAppliedTo)
            jobIDs = doc.data().jobsAppliedTo
            jobIDs.forEach((jobID) => {
                let jobRef = firebase.db.collection('jobs').doc(jobID)
                jobRef.get()
                .then(function (doc) {
                    setJobs(jobs.push(doc.data()))
                })
            })
            setJobs(jobs)
            setLoading(false)
        }).catch(function (error){
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
                />
            );
        })
    }

    return (
        <div style={{ background: "#e0e0e0" }}>
            <h1>A studnet page where you can see your applications</h1>
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

export default Applications
