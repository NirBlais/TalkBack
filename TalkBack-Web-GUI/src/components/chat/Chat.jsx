import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import './Chat.css'
import React,{ useState, useCallback, useEffect,useContext } from 'react'
import ChatMessage from "./ChatMessage/ChatMessage";
import { io } from "socket.io-client";
import {UserContext} from '../../App.jsx'
import {chatSocket} from '../../App.jsx'

// const chatSocket = io("http://localhost:5176") 
const Chat = ({targetUser,currentUser,firstMessage}) => {

  const currentDate = new Date();
  const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes().toString().padStart(2, '0')}`
  const [messages, setMessages] = useState(firstMessage?[ {
    side: false,
    text:firstMessage,
    timestamp:currentTime
  }]:[])
  
// useEffect(() => {
//   chatSocket.emit('set-username', currentUser)
// },[])

  useEffect(() => {  
    console.log("parameters:" + targetUser +" ||" +currentUser)
    // chatSocket.emit('set-username', currentUser)
    
    chatSocket.on('get-chat-message', ({message,fromUser}) => {
      console.log(`message arrived from client:" ${fromUser}"`)
      console.log(`message arrived from target:" ${targetUser}"`)
      if(fromUser == targetUser){
      console.log(`message arrived to client:" ${message}"`)
      const messageObj = {
        side: false,
        text:message,
        timestamp:currentTime
      }
      setMessages([...messages, messageObj])
      }
      else{
        console.log(`i didnt enter the if statement`)

      }
    })      
  },[messages,chatSocket])
    
  const handleSendButton = (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const {message} = Object.fromEntries(formData);
      const messageObj = {
        side: true,
        text:message,
        timestamp:currentTime
      }
      setMessages([...messages,  messageObj])
      console.log("emmiting message from client:"+currentUser+"---------------")
      chatSocket.emit('send-chat-message', {message,currentUser,targetUser})
  }

  return (
    <div className="chat">
      <div className="contact-name">{targetUser}</div>
      <div className="message-list">
        {messages.map((item) => (
          <ChatMessage
            side={item.side}
            text={item.text}
            timestamp={item.timestamp}
          />
        ))}
      </div>
      <form className="message-input" onSubmit={(e) => handleSendButton(e)}>
        
        <input className="input" name="message"></input>
        <button type="submit" className="send-button">
        <img src="../../../images/send.png" className="send-button-image" alt="send"/>
        </button>
      </form>
    </div>
  )
}

export default Chat