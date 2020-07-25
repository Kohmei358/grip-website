import React, { useState, useEffect} from 'react';
import './App.css';
import NavBar from './NavBar.js'
import LandingCarousel from './LandingCarousel.js'
import UploadFrom from './UploadForm.js'
import Applications from './Applications'
import ApplyContainer from './ApplyContainer'
import CompanyForm from './CompanyForm'
import Login from './Login'
import Signup from "./Signup"
import Test from './Test'
import Setting from './Setting'
import NeedAdmin from './NeedAdmin'
import NeedCompany from './NeedCompany'
import MyJobs from './MyJobs'
import AdminSettingsContainer from './AdminSettingsContainer'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import PrivateRoute from './PrivateRoute'
import PrivateAdminRoute from './PrivateAdminRoute'
import PrivateCompanyRoute from './PrivateCompanyRoute'

function App(){
    return(
      <Router>
        <NavBar/>
        <Switch>
          <PrivateRoute path="/setting">
            <Setting/>
          </PrivateRoute>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <PrivateRoute path="/apply">
            <ApplyContainer />
          </PrivateRoute>
          <PrivateAdminRoute path="/company">
            <CompanyForm />
          </PrivateAdminRoute>
          <PrivateRoute path="/upload">
            <UploadFrom />
          </PrivateRoute>
          <PrivateRoute path="/applications">
            <Applications />
          </PrivateRoute>
          <PrivateAdminRoute path="/admin">
            <AdminSettingsContainer/>
          </PrivateAdminRoute>
          <PrivateCompanyRoute path="/jobs">
            <MyJobs/>
          </PrivateCompanyRoute>
          <Route path="/test">
            <Test />
          </Route>
          <Route path="/needAdmin">
            <NeedAdmin />
          </Route>
          <Route path="/needCompany">
            <NeedCompany />
          </Route>
          <Route path="/">
            <LandingCarousel/>
          </Route>
        </Switch>
      </Router>
    );
}

export default App;
