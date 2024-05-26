import React from 'react'
import Header from '../../components/header/Header'
import { useEffect ,useState,useContext} from 'react'
import User from '../../components/User/User'
import './MainPage.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from "socket.io-client";
import Chat from '../../components/chat/Chat'
import ReactDOM from 'react-dom/client'
import {UserContext} from '../../App.jsx'
import NewWindow from 'react-new-window'
import {OpenChatWindow,OpenGameWindow} from '../../scripts/ChatScripts.jsx'
import { uncheckOthers } from '../../scripts/GameScripts.js'
import { gameSocket } from '../../App.jsx'


// const gameSocket = io("http://localhost:5178") // online users service



const MainPage = () => {
  // const [gameRequests,setGameRequests] = useState([111,222])
const [openedWindows,setOpenedWindows] = useState([])
// const [selectedUser,setSelectedUser] = useState(null)
const {currentUser,setCurrentUser,openedChatWindows,setOpenedChatWindows,onlineUserList,setOnlineUserList,gameRequests,setGameRequests,allUsers,selectedUser,setSelectedUser} = useContext(UserContext)
// const [openWindow,setOpenWindow] = useState(null)
// const [onlineUserList,setOnlineUserList] = useState([])
    // useEffect(() => {
    //   if(currentUser){
    //   gameSocket.emit('set-username',currentUser)
    //   }

    // },[currentUser])

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

    const SelectUser = (userName) => {
      console.log("selected user: "+userName)
      setSelectedUser(userName)
      uncheckOthers(userName)
    }
    const DeclineGameRequest = () =>{
      console.log("DeclineGameRequest")
      // gameRequests.pop()
      setGameRequests(gameRequests.slice(0, -1))
    }
    const startNewGame = () =>{
      const targetUser = gameRequests[gameRequests.length-1]
      gameSocket.emit('send-open-game',{currentUser,targetUser})
      OpenGameWindow(targetUser,currentUser,setOpenedChatWindows,openedChatWindows)
      setGameRequests(gameRequests.slice(0, -1))
    }

  console.log("openedWIndows: "+openedChatWindows)
  console.log("currentuser ------: "+currentUser)
  return (
    <>
    {/* <Header user={true} disconnect={()=>Disconnect()}/> */}
    <div className='online-users'>
      {onlineUserList.map((user) => (
        // <User userName={user} onClick={(targetUser,fromUser)=> handleOpenChat(targetUser,fromUser)}></User>
        (user!=currentUser)&&<User userName={user} SelectUser={(userName) => SelectUser(userName)} onDoubleClick={() => handleOpenChat()}></User>
        
      ))}
    </div>
    <div className='middle'>
    <button className='button' onClick={() => handleOpenChat()}>open chat</button>
    <button className='button' onClick={() => SendGameRequest()}>send game request</button>

    </div>
    <div className='offline-users'>
      {allUsers.filter((user) => !onlineUserList.includes(user.username)).map((user) => (
        <User userName={user.username} isActive={false}></User>
      ))}
    </div> 
    {/* {openWindow && 
      <NewWindow>
        <Chat targetUser={openWindow} currentUser={currentUser}/>
      </NewWindow>} */}
      {gameRequests.length > 0 && <div className='game-request-background'></div>}
          {
            gameRequests.map((user) => (
      <div className='game-request'>
        <div className='request-prompt'>player {user} wants to play with you!</div>
        <div className='request-buttons'>
          <div className='Accept-button' onClick={()=>startNewGame()}>Accept</div>
          <div className='Decline-button' onClick={()=>DeclineGameRequest()}>Decline</div>
        </div>
      </div>
            ))
          }
      
    
    <ToastContainer position='top-center' hideProgressBar={false}  theme="dark" autoClose={2000}/>
    </>
  )
}

export default MainPage