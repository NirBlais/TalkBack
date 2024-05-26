import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/signUp');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const {username, password} = Object.fromEntries(formData);

    const body = {
      "username":username,
      "password":password
    }
    console.log(JSON.stringify(body))

    fetch("https://localhost:7011/login", {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      document.cookie = `jwt_token=${JSON.stringify(data)}`
      setErrorMessage('');
      navigate('/');
      fetch("http://localhost:5175/userlogdin", {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"username":username})
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    })
    .catch((error) => {
      console.error('Error:', error);
      setErrorMessage('user does not exist');

    });

};

  return (
    <div className="login-container">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className='form-container'>
        <div className='top-right-button' onClick={() => handleNavigate()}>sign up</div>
          <form onSubmit={(e) =>handleSubmit(e)} className='form'>
            <h1 className='h1'>Login</h1>

            <label htmlFor="username">Username:</label>
            <input type="text" name="username" required/>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" required />

            <button className="login-button" type="submit">Login</button>
          </form>
      </div>
          </div>
  );
};

export default Login;
