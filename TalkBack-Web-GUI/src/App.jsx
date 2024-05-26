import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MainPage from './pages/mainPage/MainPage'
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import LoginPage from './pages/loginPage/LoginPage'
import SignUpPage from './pages/signUpPage/SignUpPage'
import HowToPlayPage from './pages/howToPlayPage/HowToPlayPage';
import AboutPage from './pages/AboutPage/AboutPage';
import Footer from './components/footer/Footer';
import Chat from './components/chat/Chat';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from "socket.io-client";
import {createContext ,useState, useEffect} from 'react';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Header from './components/header/Header';
import { OpenChatWindow, OpenGameWindow } from './scripts/ChatScripts';
import BackgammonPage from './pages/BackgammonPage/BackgammonPage';
// import { ipcRenderer } from 'electron';
// const {ipcRenderer} = window.require('electron')

const chatSocket = io("http://localhost:5176")  // chat service 
const OnlineUsersSocket = io("http://localhost:5175") // online users service
const gameSocket = io("http://localhost:5178") // online users service

export {chatSocket}
export {gameSocket}

const UserContext = createContext();

export {UserContext}



const router = createBrowserRouter([
  {
  element: <Header/>,
  children: [
    {
      path:"/",
      element:<ProtectedRoute component={<MainPage socket={OnlineUsersSocket} />}/>,
          },
        {
          path:"login",
          element:<LoginPage />,
        },
        {
          path:"signup",
          element:<SignUpPage />,
        },
        {
          path:"about",
          element:  <ProtectedRoute component={<AboutPage />}/>,
        },
        {
          path:"game",
          element:  <BackgammonPage/>,
        }
      ]
    }
  ] 
  );
   

const App = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [openedChatWindows,setOpenedChatWindows] = useState([])
  const [onlineUserList,setOnlineUserList] = useState([])
  const [allUsers,setAllUsers] = useState([])
  const [gameRequests,setGameRequests] = useState([])
  const [selectedUser,setSelectedUser] = useState(null)

  
  
  useEffect(() => {
    fetch("https://localhost:7011/getallusers", {
      method: 'GET'})
      .then(response => response.json())
      .then(data => {
        setAllUsers(data)
      })

      
    OnlineUsersSocket.on('userlogdin', (message) => {
      toast(`${message.username} connected`)
      console.log("<><><><><><><><><><><><<><>>>")
      setOnlineUserList(message.userList)
    })      
    OnlineUsersSocket.on('userlogdout', (message) => {
      toast(`${message.username} disconnected`)
      console.log(message.userList)
      setOnlineUserList(message.userList)
    })   
  },[])
  
  useEffect(()=>{
    if(currentUser){
      chatSocket.emit('set-username', currentUser)
      gameSocket.emit('set-username',currentUser)
    }

  },[currentUser])
  
  useEffect(()=>{

      chatSocket.once('get-chat-message', ({message,fromUser}) => {
        console.log("--------from user:   "+fromUser)
        console.log("chatWindows: " + openedChatWindows)
        console.log("!openedChatWindows.includes((fromUser).toString(): "+!openedChatWindows.includes((fromUser).toString()))
        if(!openedChatWindows.includes((fromUser).toString())){
          console.log("i was able to enter -------------")
          OpenChatWindow(fromUser,currentUser,setOpenedChatWindows,openedChatWindows,message)
        }
      })
    
    return () =>{
      chatSocket.off("get-chat-message")
    }
  },[openedChatWindows])
  useEffect(() => {
    if(currentUser){

    
    gameSocket.on('open-game',({fromUser}) =>{
      console.log("open game request from22222: "+fromUser)
      OpenGameWindow(fromUser,currentUser,setOpenedChatWindows,openedChatWindows,true)
      // gameSocket.emit('start-game',({currentUser,targetUser:fromUser}))
    })
    gameSocket.on('get-game-request',({fromUser}) =>{
      setGameRequests([...gameRequests,fromUser])
    })
  }
  return () =>{
    gameSocket.off('open-game')
    gameSocket.off('get-game-request')
  }
},[currentUser,gameRequests])
return (
  <>
      <UserContext.Provider value={{currentUser,setCurrentUser
        ,openedChatWindows,setOpenedChatWindows
        ,onlineUserList,setOnlineUserList
        ,gameRequests,setGameRequests
        ,allUsers,
        selectedUser,setSelectedUser}}>
        <RouterProvider router={router}/>
        <Footer/>
        {/* <ToastContainer position='top-center' hideProgressBar={false}  theme="dark" autoClose={2000}/> */}
      </UserContext.Provider>

    </>
  )
}

export default App