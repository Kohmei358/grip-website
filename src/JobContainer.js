import React from "react"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Image from './Image'
import ApplyModal from "./ApplyModal.js"

function JobContainer(props){

  const imageURL = "https://picsum.photos/" + (800 + props.index) +"/100"
  //just to randomize image

  const handleClick = () => props.handleShow(props.index)

  return(
    <>
      <Card>
        <Card.Img variant="top" src={imageURL} style={{height:"7em"}} />
        <Card.Body>
          <Card.Title>{props.companyName} - {props.name}</Card.Title>
          <Card.Text>
            <pre>
              Deadline: {props.dl}
            </pre>
            <pre>
              {props.info}
            </pre>
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button onClick={handleClick}> Apply! </Button>
        </Card.Footer>
      </Card>
      {/*Normally Hidden*/}
      <ApplyModal
        studentName={props.studentName}
        jobTitle={props.name}
        companyName={props.companyName}
        key={props.index}
        index= {props.index}
        handleClose={props.handleClose}
        handleShow={props.handleShow}
        show={props.show}
      />
    </>
  )
}

export default JobContainer

//This is for Image Placeholder before loading is done
// <img src="%PUBLIC_URL%/TempImg.png"/>
// <Image src={imageURL}/>
