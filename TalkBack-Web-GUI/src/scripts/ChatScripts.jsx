import ReactDOM from 'react-dom/client'
import Chat from '../components/chat/Chat'  
import BackgammonPage from '../pages/BackgammonPage/BackgammonPage.jsx'
import React from 'react'
import UserContext from '../App.jsx'

  
  const OpenGameWindow = (targetUser,currentUser,setOpenedChatWindows,openedChatWindows,initialize=false) => {
    // setOpenedChatWindows([...openedChatWindows,targetUser])
    const newWindow = window.open('', '_blank', 'resizable=no,width=500,height=500')
    newWindow.document.write('<div id="component-container"></div>')
    ReactDOM.createRoot(newWindow.document.getElementById('component-container')).render(
    <BackgammonPage targetUser={targetUser} currentUser={currentUser} CloseWindow={()=>{newWindow.close()}} setOpenedChatWindows={setOpenedChatWindows}  openedChatWindows={openedChatWindows} initialize={initialize}/>
    )
    copyStyles(window.document, newWindow.document)
    newWindow.onbeforeunload = () => {
      // setOpenedChatWindows(openedChatWindows.filter((item) => item !== targetUser))//delete targetUser from openedWindows
      // console.log("openedWIndows: "+openedChatWindows)
    }
  }

  export { OpenGameWindow }
  const OpenChatWindow = (targetUser,currentUser,setOpenedChatWindows,openedChatWindows,firstMessage) => {
    setOpenedChatWindows([...openedChatWindows,(targetUser).toString()])
    const newWindow = window.open('', '_blank', 'resizable=no,width=350,height=500')
    newWindow.document.write('<div id="component-container"></div>')
    ReactDOM.createRoot(newWindow.document.getElementById('component-container')).render(
    <Chat  targetUser={targetUser} currentUser={currentUser} firstMessage={firstMessage}/>
    )
    copyStyles(window.document, newWindow.document)
    newWindow.onbeforeunload = () => {
      setOpenedChatWindows(openedChatWindows.filter((item) => (item).toString() !== (targetUser).toString()))//delete targetUser from openedWindows
      console.log("openedWIndows: "+openedChatWindows)
    }
  }

  export { OpenChatWindow }
  function copyStyles(src, dest) {
    Array.from(src.styleSheets).forEach(styleSheet => {
        dest.head.appendChild(styleSheet.ownerNode.cloneNode(true))
    })
    Array.from(src.fonts).forEach(font => dest.fonts.add(font))
}