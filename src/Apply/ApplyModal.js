import React, { useContext, useState, useEffect } from "react"
import { Modal, Button, Collapse, Spinner } from 'react-bootstrap'
import { Formik, Field, Form } from 'formik';

import FirebaseContext from '../Firebase'
import AuthContext from '../Firebase/AuthContext'

function ApplyModal(props) {
  const firebase = useContext(FirebaseContext)
  const authContext = useContext(AuthContext)
  const [newSelected, setNewSelected] = useState(true)
  const [openNew, setOpenNew] = useState(true)
  const [openDef, setOpenDef] = useState(false)
  const [defResumeName, setDefResumeName] = useState('')
  const [timeSinceUpload, setTimeSinceUpload] = useState(null)
  const [fileUploaded, setFileUploaded] = useState(false)

  const getDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy
  }

  function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  const handleConfirm = () => {
    alert(props.studentID + " is appying to " + props.jobID)
    //Write to DB Here
    //Can be made a cloud function later
    let resumeName
    if (newSelected){ // user has uploaded a new resume
      resumeName = props.studentID + props.jobID + '.pdf'
    } else {
      resumeName = props.studentID + '.pdf'
    }

    firebase.db.collection('applications').add({
      studentID: props.studentID,
      jobID: props.jobID,
      title: props.title,
      dl: props.dl,
      location: props.location,
      resumeName: resumeName, 
      applyDate: getDate(),
      downloaded: '',
      companyName: props.companyName,
      companyLogoURL: props.companyLogoURL
    }).then(function (doc) { // 8/18

    })

    let studentRef = firebase.db.collection('students').doc(props.studentID)
    studentRef.get().then(function (doc) { // append job's document id to studnet's jobsAppliedTo field
      studentRef.update({ jobsAppliedTo: firebase.raw.firestore.FieldValue.arrayUnion(props.jobID) })
    })
    let jobRef = firebase.db.collection('jobs').doc(props.jobID)
    jobRef.get().then(function (doc) { // append student's id to job's applicants field
      jobRef.update({ applicants: firebase.raw.firestore.FieldValue.arrayUnion(props.studentID) })
    })

    //Close Modal
    props.handleClose()

  }

  useEffect(() => {
    let uid = authContext.user.uid
    firebase.db.collection('students').doc(uid).get().then(function(doc){
      if (doc.data().defResumeName){
        setDefResumeName(doc.data().defResumeName)
      } else {
        return
      }
      let lastUploadTime = doc.data().lastUploadTime
      setTimeSinceUpload(' — uploaded ' + timeSince(lastUploadTime) + ' ago')
    })
  }, [])

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Apply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>User: {props.studentName} &nbsp;</b> {/*nbsp is to force space*/}
        is about to apply to
        <br />
          <b>Internship: {props.title} at {props.companyName}</b>
          <br />

          <form>
            <input type="radio" id="new"
              aria-expanded={openNew} onChange={() => {
                setOpenNew(true)
                setOpenDef(false)
                setNewSelected(true)
              }} checked={newSelected} />
            <label htmlFor="new">Upload a New Resume</label>
            <Collapse in={openNew}>
              <div>
                <Formik
                  enableReinitialize={true} x
                  initialValues={{ file: '' }}
                  onSubmit={(values, {setSubmitting}) => {
                    let resumeRef = firebase.storage.child(props.studentID + props.jobID + '.pdf')
                    resumeRef.put(values.file).then(() => {
                      setFileUploaded(true)
                      setSubmitting(false)
                      alert('File uploaded')
                    }).catch(function(error){
                      setSubmitting(false)
                      alert(error)
                    })
                  }}
                >
                  {({ isSubmitting, setFieldValue, dirty }) => (
                    <Form>
                      <div className="form-group">
                        <input name="file" type="file" accept=".pdf" onChange={(event) => {
                          setFieldValue("file", event.currentTarget.files[0]);
                        }} className="form-control" />
                      </div>
                      <button className="my-2 btn btn-primary bg-wb" type="submit" disabled={!dirty || isSubmitting}>
                      {isSubmitting && <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />}
                      Submit
                    </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </Collapse>
            <br/>
            <input type="radio" 
              id="old"
              onChange={() => {
              setOpenNew(false)
              setOpenDef(true)
              setNewSelected(false)
            }} checked={!newSelected} />
            <label htmlFor="old">Upload your default resume</label>
            <Collapse in={openDef}>
              <div>
                {defResumeName
                    ? <div><i>{defResumeName}</i>{timeSinceUpload}</div>
                    : <i>You haven't uploaded any resume yet!</i>}
              </div>
            </Collapse>
          </form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={(newSelected && !fileUploaded) || (!newSelected && !defResumeName)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ApplyModal
