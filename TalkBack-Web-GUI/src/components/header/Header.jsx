import React, { useContext, useState } from 'react'
import './Header.css'
import {Outlet, useNavigate} from 'react-router-dom'
import {CSSTransition} from 'react-transition-group'
import {UserContext} from '../../App.jsx'
import {Logout,DeleteCookie} from '../../scripts/AuthenticationScritps.js'
import { Children } from 'react'
import {gameSocket} from '../../App.jsx'
import { OpenChatWindow } from '../../scripts/ChatScripts.jsx'
import { toast } from 'react-toastify'
import { io } from "socket.io-client";

const Header = () => {
  const {currentUser,setCurrentUser,openedChatWindows,setOpenedChatWindows,selectedUser,setSelectedUser} = useContext(UserContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    console.log("toggle clicked")

  }
  const toggleActions = () => {
    setIsActionsOpen(!isActionsOpen)
    console.log("toggle clicked")

  }
  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen)
    console.log("toggle clicked")

  }

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/');
  }

  const handleConnect = () => {
    setIsMenuOpen(!isMenuOpen)
    navigate('/login');
  }
  const handleDisconnect = () =>{
    fetch("http://localhost:5175/userlogdout", {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"username":currentUser})
    })
    .then((data) => {
      Logout(setCurrentUser)
      setIsMenuOpen(!isMenuOpen)
      DeleteCookie('jwt_token')
      console.log('Success:'+data);
      navigate('/login');
      
    })
    .catch((error) => {
      console.log('Error:', error);
    })


  }
  const handleAbout = () => {
    setIsMenuOpen(!isMenuOpen)
    navigate('/about');
  }

  
  const handleOpenChat = (targetUser=selectedUser) => {
    if(targetUser){
      OpenChatWindow(targetUser,currentUser,setOpenedChatWindows,openedChatWindows)
    }
  }
  const SendGameRequest = (targetUser=selectedUser) => {

    if(targetUser){
      toast("game request sent to: "+selectedUser)
      gameSocket.emit('send-game-request',{currentUser,targetUser})
      // OpenGameWindow(targetUser,currentUser,setOpenedChatWindows,openedChatWindows)
    }
  }

  return (
      <>
    <header className="header">
      <div className='red-dot-alert'></div>
      <div className="title" onClick={() => handleNavigate()}>Talk-Back</div>
      <div className="hello-user">Hello {currentUser ? currentUser : "user"}</div>
        <img
            className="user-image"
            src="../images/user.png"
            alt="Profile Image"
        />
        <img
        className="menu-image"
            src="../images/menu.png"
            alt="menu"
            onClick={toggleMenu}
        />
         <CSSTransition in={isMenuOpen} timeout={500} classNames="menu-background" unmountOnExit >
         <div className='menu-background' onClick={toggleMenu}></div>

         </CSSTransition >
        <CSSTransition in={isMenuOpen} timeout={500} classNames="menu-primary" unmountOnExit>

            <div className="menu">
            <div className='menu-contents'>
              {!currentUser && (<div className='option' onClick={()=>handleConnect()}>Connect</div>)}

                {currentUser && <div className='option' onClick={()=>handleDisconnect()}>Disconnect</div>}
                {currentUser&&<div className='option'onClick={()=>toggleActions()}>
                Actions
                 {isActionsOpen && (
                   <>
                        <div onClick={()=>handleOpenChat()}>Chat</div>
                        <div onClick={()=>SendGameRequest()}>Play</div>
                    </>
                    )}
                </div>}
                <div className='option' onClick={()=>toggleHelp()}>
                 Help
                {isHelpOpen && (
                    <>
                          <div>
                        <a href='https://www.youtube.com/watch?v=xXE5AwzNQ2s'>
                            How to Play
                        </a>
                            </div>
                        <div onClick={()=>handleAbout()}>About</div>
                    </>
)}
            </div>
          </div>
        </div>

</CSSTransition>
    </header>
      <Outlet/>
      </>
  )
}

export default Header
