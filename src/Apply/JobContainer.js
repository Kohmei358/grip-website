import React, { useState, useEffect } from "react"
import { Card, Button, Collapse, Badge, Row, Col } from 'react-bootstrap'

import * as marked from 'marked'

import ApplyModal from "./ApplyModal.js"

import styles from './JobContainer.module.scss';

//Job card for Apply page
function JobContainer(props) {

  // const imageURL = "https://picsum.photos/" + (800 + props.index) + "/100"
  //just to randomize image

  const handleClick = () => props.handleShow(props.index)

  const [open, setOpen] = useState(false)
  const [reqSkills, setReqSkills] = useState()
  const [preSkills, setPreSkills] = useState()
  const [info, setInfo] = useState()
  const [companyInfo, setCompanyInfo] = useState()
  const [localApplied, setLocalApplied] = useState(false) // turn true after one applies to the job, disabling the Apply button

  function timeSince(date) {

    var days = Math.ceil((new Date() - date) / 1000 / 86400);

    var interval = days / 365;

    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = days / 30;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }

    if (days === 1){
      return days + " day"
    } else {
      return days + " days"
    }
  }


  useEffect(() => {
    if (props.reqSkills && props.preSkills) {
      let reqSkillsBuilder, preSkillsBuilder
      reqSkillsBuilder = props.reqSkills.map(skill => {
        return <Badge className="mr-1" variant="secondary">{skill}</Badge>
      })
      preSkillsBuilder = props.preSkills.map(skill => {
        return <Badge className="mr-1" variant="secondary">{skill}</Badge>
      })
      setReqSkills(reqSkillsBuilder)
      setPreSkills(preSkillsBuilder)
    }
    if (props.info){
      setInfo(<p dangerouslySetInnerHTML={{ __html: marked(props.info) }} />)
    }
    if (props.companyInfo){
      setCompanyInfo(<p dangerouslySetInnerHTML={{ __html: marked(props.companyInfo) }} />)
    }
  }, [])



  return (
    <>
      <Card>
        <Card.Header>
          <Row>
            <Col sm={3}>
              <img src={props.companyLogoURL} width="150"></img>
            </Col>
            <Col sm={9}>
              <Card.Title>{props.title}</Card.Title>
              <Card.Text style={{ wordWrap: "breakWord" }}>
                {props.companyName} <br />
                {props.location} <br />
                Duration: {props.duration} <br />
                Required Skills: <br />
                {reqSkills} <br />
                Preferred Skills: <br />
                {preSkills} <br/>
                {props.reqCoverLetter &&
                  <p className="text-danger">Requires Cover Letter <br/> </p>}
                Posted: {timeSince(props.timePosted) + ' ago'}
              </Card.Text>
              <Button onClick={() => setOpen(!open)}
                aria-expanded={open}>
                Expand
          </Button>
            </Col>
          </Row>

        </Card.Header>
        <Collapse in={open}>
          <Card.Body className={styles.markDown}>
            <h6>About {props.companyName}: </h6>
            {companyInfo} <br />
            <h6>About the Job:</h6>
            {info}
          </Card.Body>
        </Collapse>

        <Card.Footer>
          <Button disabled={props.applied || localApplied} onClick={handleClick}> Apply! </Button>
          {(props.applied || localApplied) && <p className="font-italic">You've applied to this job</p>}
        </Card.Footer>
      </Card>
  
      <ApplyModal
        key={props.index}
        index={props.index}
        studentName={props.studentName}
        studentID={props.studentID}
        title={props.title}
        jobID={props.jobID}
        dl={props.dl}
        location={props.location}
        companyName={props.companyName}
        companyLogoURL={props.companyLogoURL}
        reqCoverLetter={props.reqCoverLetter}
        handleClose={props.handleClose}
        handleShow={props.handleShow}
        show={props.show}
        setLocalApplied={setLocalApplied}
      />
    </>
  )
}

export default JobContainer

//This is for Image Placeholder before loading is done
// <img src="%PUBLIC_URL%/TempImg.png"/>
// <Image src={imageURL}/>
