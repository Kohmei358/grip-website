import React, {useContext} from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useLocation } from 'react-router-dom'

import AuthContext from '../Firebase/AuthContext'
import NavAuthSection from './NavAuthSection'
import useWindowDimensions from '../useWindowDimensions.js'

import styles from './NavBar.module.scss';

import logo from '../Media/Logo.svg'
/**
Navigation bar uses React-Bootsrap nav. Contains StudentNavLinks,
Company Nav Links, and Admin Nav Links, which hide and show depending on
the Auth Context. Nav Auth Section is the profile picutre and dropdown.
*/
function NavBar(props){
  const authContext = useContext(AuthContext)
  // console.log(authContext.isVerified, "emailVerfied?")
  let location = useLocation();
  let isDarkText = null;
  const { height, width } = useWindowDimensions();
  if(shouldTextBeWhite(location.pathname, width)){
    isDarkText = styles.brightText;
  }else{
    isDarkText = styles.darkText;
  }
  return(
    <ul className={styles.nav}>
        <LinkContainer to="/">
        <li className={styles.logo}>
            <img src={logo} alt="Logo"/>
            <p className={styles.asesText}>ASES</p>
            <p className={styles.abroadText}>Abroad</p>
        </li>
        </LinkContainer>
        <li className={`${styles.navOptions} ${isDarkText}`}>
            <StudentNavLinks isVisible={authContext.isAuthenticated}/>
            <CompanyNavLinks isVisible={authContext.isCompany && authContext.isAuthenticated}/>
            <AdminNavLinks isVisible={authContext.isAdmin && authContext.isAuthenticated}/>
            <NavAuthSection />
        </li>
    </ul>
  );
}

function shouldTextBeWhite(location, width){
  return(location == "/" && width > 650)
}

function StudentNavLinks(props){
  return(props.isVisible ?
    <LinkContainer to="/apply">
        <a>Apply (Job Search)</a>
    </LinkContainer>:
  null)
}

function CompanyNavLinks(props){
  return(props.isVisible ?
    <LinkContainer to="/jobs">
      <a>My Posted Jobs</a>
    </LinkContainer>:
  null)
}

function AdminNavLinks(props){
  return(props.isVisible ?
    <><LinkContainer to="/create-company">
      <a>Create Company</a>
    </LinkContainer>
    <LinkContainer to="/admin">
      <a>Admin Settings</a>
    </LinkContainer></>:
  null)
}



export default NavBar
