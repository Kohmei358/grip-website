import React from "react"
import LandingCarousel from './LandingCarousel.js'
import UploadFrom from './UploadForm.js'
import ApplyContainer from './ApplyContainer'
import CompanyForm from './CompanyForm'

function MainContent(props){
  if(props.pageNum === 0){
    return(
        <LandingCarousel />
    );
  }else if(props.pageNum === 1){
    return(
      <UploadFrom />
    );
  }else if(props.pageNum === 2){
    return(
      <CompanyForm />
    );
  }else if(props.pageNum === 3){
    return(
      <ApplyContainer />
    );
  }else{
    return(<h1>Something is wrong.</h1>)
  }
}

export default MainContent
