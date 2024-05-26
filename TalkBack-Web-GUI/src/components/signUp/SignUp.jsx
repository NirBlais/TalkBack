import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'


const SignUp = () => {

  
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/login')
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget);
    const {username, password, confirmPassword} = Object.fromEntries(formData);
    setErrorMessage("");

    // if(payload.username ==='a') setErrorMessage('incorrect username or password')
    // else  setErrorMessage(' ')
    const body = {
      "username":username,
      "password":password,
      "confirmPassword":confirmPassword
    }
    console.log(JSON.stringify(body))

    fetch("https://localhost:7011/register", {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    
    })
    .then(response => {
      console.log(response)
      return response.json()
  })
    .then(data => {
      console.log(data.errorMessages)
      if(data.errorMessages) setErrorMessage(data.errorMessages[0])
      
    })
    .catch((error) => {
      if(!error)   console.error(JSON.stringify(error))
    });

}

  return (
    <div className="login-container">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className='form-container'>

      <div className='top-right-button' onClick={() => handleNavigate()} >Login</div>
      <form onSubmit={(e)=>handleSubmit(e)} className='form'>
        <h1 className='h1'>Sign Up</h1>

        <label htmlFor="username">Username:</label>
        <input type="text" name="username"required/>
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" required/>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input type="password" name="confirmPassword" required />

        <button className='login-button' type="submit">SignUp</button>
      </form>
    </div>
    </div>
  );
};

export default SignUp;
