import Board from '../../components/GameComponents/Board/Board'
import React, { useEffect, useRef, useState } from 'react'
import {RollDice, getPoints,FlipBoard,FlipEatenPieces } from '../../scripts/GameScripts.js'
import './BackgammonPage.css'
import { io } from "socket.io-client";
import {OpenChatWindow} from '../../scripts/ChatScripts.jsx'
import { toast ,ToastContainer} from 'react-toastify';
import { gameSocket } from '../../App.jsx';
import Countdown from 'react-countdown';



// const gameSocket = io("http://localhost:5178") 


const BackgammonPage = ({targetUser,currentUser,CloseWindow,setOpenedChatWindows,openedChatWindows,initialize}) => {
    const [dice, setDice] = useState([])
    const[resignPopup, setResignPopup] = useState(false)
    const[yourTurn, setYourTurn] = useState(false)
    const[board, setBoard] =useState(getPoints())
    const [eatenPieces,setEatenPieces] = useState([])
    const [gameEnded,setGameEnded] = useState(-1)
    const [forfeit,setForfeit] = useState(null)
    const [rollAnimation,setRollAnimation] =useState(true)



    // useEffect(()=>{
    //   setGameEnded(-1)
    // },[])

    const Forfeit = () =>{
      if(yourTurn && gameEnded === -1){
        setForfeit("you forfeited the match")
        setResignPopup(false)
        gameSocket.emit("send-forfeit",{fromUser:currentUser,targetUser})
        
      }
    }
    const setRollNewAnimation =(g) =>{
      setRollAnimation(g)
    }
  const setDiceResult = (d) =>{
    setDice(d)
  }
  const setNewBoard =(b)=>{
    setBoard(b)
  }
  const setNewEatenPieces = (t) =>{
    setEatenPieces(t)
  }
  const setNewGameEnded = () =>{
    if(gameEnded=== -1)
      {
        setGameEnded(currentUser)
        gameSocket.emit("send-winner",({fromUser:currentUser,targetUser}))

      }
    
  }


  useEffect(()=>{
    gameSocket.once('first-move', ({diceRolls,isBeginner}) => {
      console.log("game had started---------------------<><><><><><><><><><><>><><---")
      if(!isBeginner){
        setBoard(FlipBoard(board))
      }
      setYourTurn(isBeginner)
      toast(diceRolls)
      toast(isBeginner ? `${currentUser} starts` : `${targetUser} starts`)
      setDice(RollDice())
      // setGameEnded(-1)
      
    })
    return()=>{
  //  setGameEnded(-1)
gameSocket.off('first-move')
 }
},[])
    useEffect(() => {
  gameSocket.on('get-pass-turn',({fromUser})=>{
    if(targetUser==fromUser && !yourTurn){
      setDice(RollDice())
      setYourTurn(true)
    }
  })
  return () =>{
    gameSocket.off('get-pass-turn')
  }
},[yourTurn])
useEffect(()=>{
  gameSocket.once("get-winner",({fromUser})=>{
    setGameEnded(fromUser)
    setRollAnimation(false)
  })
  return()=>{
    // setGameEnded(-1)
    gameSocket.off('get-winner')
  }
},[])
useEffect(()=>{
  gameSocket.on('get-move',({newBoard,newEatenPieces,fromUser })=>{
    console.log("im here in get move --------------------------")
    console.log(newBoard)
    if(targetUser==fromUser && !yourTurn){
      setBoard(FlipBoard(newBoard)) 
      setEatenPieces(FlipEatenPieces(newEatenPieces))
      
    }
  })
  
  return()=>{
    gameSocket.off('get-move')
  }
},[yourTurn])

useEffect(()=>{
  gameSocket.once('get-forfeit',({fromUser})=>{
    if(targetUser == fromUser && !yourTurn && gameEnded===-1){
      setForfeit("opponent forfeited the match")
    }
  })
  return()=>{
    gameSocket.off('get-forfeit')
  }
},[])

useEffect(()=>{
  if(initialize){
    gameSocket.emit('start-game',({currentUser,targetUser}))
  }
},[])

const Submit = () => {
  setDice(RollDice())
}
    const Resign = () => {
      setResignPopup(false)
      CloseWindow()
    }
    const handleOpenChat = () => {
      if(targetUser){
        OpenChatWindow(targetUser,currentUser,setOpenedChatWindows,openedChatWindows)
      }
    }
    const handleSendMove = (newBoard,newEatenPieces) => {
      if(yourTurn){
        gameSocket.emit('send-move', {newBoard,newEatenPieces,fromUser:currentUser,targetUser})

      }
    }
    const PassTurn = () =>{
      setYourTurn(!yourTurn)
      if(yourTurn){
        gameSocket.emit('pass-turn',{fromUser:currentUser,targetUser})

      }
    }
    
    
    console.log(dice)
    return (
      <>
      {/* <ToastContainer position='top-center' hideProgressBar={false}  theme="dark" autoClose={2000}/> */}
      <div className='game'>
        <div className='text-box'>opponent:{targetUser}</div>
        <Board diceResult={dice} rollAgain={() => Submit()} yourTurn={yourTurn}
         sendMove={(newboard,newEatenPieces)=>handleSendMove(newboard,newEatenPieces)} passTurn={()=>PassTurn()} 
         board={board} setBoard={(b)=>setNewBoard(b)} setDiceResult={(d)=>setDiceResult(d)}
         eatenPieces={eatenPieces} setEatenPieces={(t)=>setNewEatenPieces(t)}
         gameEnded={gameEnded} setGameEnded={(g)=>setNewGameEnded(g)}
         rollAnimation={rollAnimation} setRollAnimation={(g)=>setRollNewAnimation(g)}
         ></Board>
        {/* <button onClick={() => Submit()}>roll</button> */}
        <div className='text-box'>
          Your Moves:
        {
          dice.join(',')
        }
        </div>
      {yourTurn && !forfeit && !rollAnimation ?
      <Countdown
    date={Date.now() + 120000}
    intervalDelay={0}
    renderer={props => <div className='text-box'>{Math.floor(props.total/60000)}:{(props.total%60000)/1000}</div>}
    onComplete={()=>Forfeit()}
  />:<div className='text-box'>0:00</div>}
      <div className='game-page-button-resign' onClick={()=>setResignPopup(true)}>Resign</div>
      <div className='game-page-button'onClick={()=>handleOpenChat()}>Chat</div>
      {resignPopup &&
      <div className='resign-background'>
      <div className='resign-popup'>
        <div className='resign-prompt'>are you sure you want to resign?</div>
        <div className='resign-buttons'>
          <div className='Yes-button' onClick={()=>Forfeit()}>Yes</div>
          <div className='No-button' onClick={()=>setResignPopup(false)}>No</div>
        </div>
      </div>
      </div>
      }
      {forfeit&& <div className='opponent-turn-cover'>{forfeit}</div>}
      </div>
    </>
  )
}

export default BackgammonPage