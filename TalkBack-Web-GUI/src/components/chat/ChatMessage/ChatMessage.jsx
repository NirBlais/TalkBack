import React from 'react'
import './ChatMessage.css'

const ChatMessage = ({side=true, text="placeholder", timestamp="4:12"}) => {
  return (
      <div className={`chat-message  ${side && 'right'} `}>
          <div className='message'>{text}</div>
          <div className='timestamp'>{timestamp}</div>
      </div>


  )
}

export default ChatMessage