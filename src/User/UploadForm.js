import ProgressBar from 'react-bootstrap/ProgressBar'
import React from 'react';
import { Formik } from "formik";
import * as yup from "yup"
import {useDropzone} from 'react-dropzone'

import FirebaseContext from "../Firebase/"

function Dropzone(props) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));


  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}


class UploadForm extends React.Component {
  constructor(props){
    super(props)
    this.state={progressBar: 0,uploading: false}

  }
  static contextType = FirebaseContext;
  render() {
    const that = this;
    let firebase = this.context;
    const user = firebase.auth.currentUser
    return (
      <div className="container">
        <Dropzone />
        <Formik
          initialValues={{ file: null }}
          onSubmit={(values, resetForm) => {
            alert(
              JSON.stringify(
                {
                  fileName: values.file.name,
                  type: values.file.type,
                  size: `${values.file.size} bytes`
                },
                null,
                2
              )
            );
            let smallFile = false
            let resume = values.file
            if (resume.size > 5 * 1024 * 1024){ // 5 MB limit
                alert("File is too large")
                resetForm()
            } else {
                if (resume.size <= 256 * 1024){
                    smallFile = true
                }
            }

            let storageRef = firebase.storage
            let resumeRef = storageRef.child(user.uid + '.pdf')
            let uploadTask = resumeRef.put(resume)
            that.setState({uploading: true})
            uploadTask.on('state_changed', function(snapshot){
                if (smallFile){ // automatically fills up the progress bar
                    that.setState({progressBar: 100})
                } else { // regularly shows the progress
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    that.setState({progressBar: progress})
                }
                smallFile = false
            }, function(error){

            }, function(){
                alert('Upload Successful')
            })

            }
          }
          validationSchema={yup.object().shape({
            file: yup.mixed().required(),
          })}
          render={({ values, handleSubmit, setFieldValue }) => {
            return (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="file">Resume Upload</label>
                  <input id="file" name="file" type="file" onChange={(event) => {
                    setFieldValue("file", event.currentTarget.files[0]);
                  }} className="form-control" />
                </div>
                {this.state.uploading && <ProgressBar now={this.state.progressBar}/>}
                <br />
                {this.state.uploading
                  ? <button type="submit" className="btn btn-dark" disabled>Uploading</button>
                  : <button type="submit" className="btn btn-primary">Submit</button>}
              </form>
            );
          }} />
      </div>
    );
  }
};

export default UploadForm
