import React, { useState } from 'react';
import { getAuth, signInWithPopup, FacebookAuthProvider, updateProfile, signInWithEmailAndPassword , createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail   } from 'firebase/auth'
import initializeAuthentication from '../firebase/firebase.init';
import './Practice.css'

initializeAuthentication();


const faceBookProvider = new FacebookAuthProvider()
const Practice = () => {
    const auth = getAuth()
    // hook  
    const [isLogin, setLogin] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    // hook  
    const logincheck = e => {
        setLogin(e.target.checked)
    }

    const nameChange = e => {
      setName(e.target.value)
    }
    const passwordChange = e => {
      setPassword(e.target.value)
    }
    const emailChange = e => {
      setEmail(e.target.value)
    }

    const submitHandler = e =>{
      e.preventDefault()
  
      if(password.length < 6){
          setError('Password Must be 6 Character long')
      return;
      
      }
        if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
            setError('Password must 2 letters in Upper Case')
            return;
        }
        if(!/(?=.*[!@#$&*])/.test(password)){
            setError('Password must 1 Special Character')
            return;
        }
        if(isLogin){
          loginAccount(email, password)
        }
        else{
          createNewuser(email, password)
        }
  }


  const loginAccount = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user 
      console.log(user)
      setError('')
    })
    .catch(error=> {
      setError(error.message)
    })
  }

  const createNewuser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user
      console.log(user)
      setError('')
      newUser()
      emailVery()

     })
     .catch(error=> {
      setError(error.message)
    })
  }
 
 const newUser = () => {
  updateProfile(auth.currentUser, {displayName: name})
  .then(result => {
    console.log(result) 
    setError('')
  })
  .catch(error=> {
    setError(error.message)
  })
 }
    
    // updateProfile 

    const emailVery = () => {
      sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result)
      })
    }

    //  reset password 
    const resetPassword = (email) => {
      sendPasswordResetEmail(auth, email)
      .then(result => {
        console.log(result)
      })
    }
// facebook 
   const providerFacebook = () => {
    signInWithPopup(auth, faceBookProvider)
    .then(result => {
        const user = result.user;
        console.log(user)

    })
    .catch(error => {
        console.log(error.message)
    })

}
// facebook 




    return (
      <div className="login-from">
      <form onSubmit={submitHandler} className="width mx-auto">
          <h2 className="text-primary">Please {isLogin ?  'Login': 'Register'}</h2>
          <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label text-dark">Email</label>
              <div className="col-sm-10">
              <input onBlur={emailChange} type="email" className="form-control" id="inputEmail3" required/>
              </div>
          </div>
         {!isLogin && <div className="row mb-3">
              <label htmlFor="name" className="col-sm-2 col-form-label text-dark">Name</label>
              <div className="col-sm-10">
              <input onBlur={nameChange} type="text" className="form-control" id="name" required/>
              </div>
          </div>}
          <div className="row mb-3">
              <label htmlFor="inputPassword3" className="col-sm-2 col-form-label text-dark">Password</label>
              <div className="col-sm-10">
              <input onBlur={passwordChange} type="password" className="form-control" id="inputPassword3" required/>
              </div>
          </div>
          <div className="row mb-3">
              <div className="col-sm-10 offset-sm-2">
              <div className="form-check">
                  <input onChange={logincheck} className="form-check-input text-dark" type="checkbox" id="gridCheck1"/>
                  <label className="form-check-label text-dark" htmlFor="gridCheck1">
                  {isLogin ? ' Login' : 'Register'}
                  </label>
              </div>
              </div>
          </div>
          <div className="row mb-3 text-danger">
              {error}
          </div>
          <button type="submit" className="btn btn-danger  " onClick={resetPassword}>Reset Password</button> 
          <button type="submit" className="btn btn-primary ms-2">Register</button>
          <button type="submit" className="btn btn-primary ms-2" onClick={providerFacebook}>Facebook</button>

          </form>
      </div>
    );
};

export default Practice;