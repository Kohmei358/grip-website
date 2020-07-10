import React , {useState, useEffect, useContext} from 'react'
import {FirebaseContext} from './Firebase'

// import fire from './Fire';

function TestPage(){

    const firebase = useContext(FirebaseContext)
    console.log(firebase.bob)
    // console.log(fire.firestore())
    const[text,setText] = useState("Default Text / No Info")
    const db = firebase.bob.firestore()
    console.log("DB Next:")
    console.log(db)

    // useEffect(() => {
    //   db.collection('companies')
    //       .get()
    //       .then(function (querySnapshot){ // no condition for query, thus returns all companies
    //           console.log("In compnay list")
    //           console.log(querySnapshot.docs.length)
    //           if (querySnapshot.docs.length === 0){
    //               setText('Oops, there are currently no available internship!')
    //           }
    //
    //           querySnapshot.forEach(function (doc){
    //               let company = doc.data()
    //               let companyName = company.companyName
    //               let info = company.info
    //               console.log("Name: " + companyName)
    //               console.log("Info: " + info)
    //               setText(companyName + "  /  " + info)
    //           })
    //       }).catch(function(error){
    //           console.log(error)
    //       })
    // },[]); //Run only onMount

    return(
      <div>
        Hi. This Div works
        <br />
        {text}
      </div>
    )
}



export default TestPage
