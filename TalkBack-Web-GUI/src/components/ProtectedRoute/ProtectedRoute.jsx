import React, { useEffect, useState , useContext } from 'react'

import MainPage from '../../pages/mainPage/MainPage.jsx';
import Login from '../login/Login.jsx';
import { Navigate, json } from 'react-router-dom';
import {UserContext} from '../../App.jsx'
import { GetTokens,VerifyToken } from '../../scripts/AuthenticationScritps.js';



const ProtectedRoute = ({component}) => {
  const {currentUser,setCurrentUser,openedChatWindows,setOpenedChatWindows,chatSocket} = useContext(UserContext)
  const [canEnter, setCanEnter] = useState(null);
    
    const CanEnter = async() =>{
      const tokens = GetTokens("jwt_token") //gets the tokens(access,refresh) from the cookie
      if (tokens) {
        const result = await VerifyToken(tokens,setCurrentUser)
        return result
      } else{
        console.error('you dont have any tokens to access this page');
        return false
      }
    }

    useEffect(() => {
      CanEnter().then(result => {
        setCanEnter(result)
      })
    }, [])
    return(
      <>
        {canEnter === null && <div>Loading...</div>}
        {canEnter === true && component}
        {canEnter === false && <Navigate to={"/login"}/>}
      </>
    )

}

export default ProtectedRoute