import React, { useEffect ,useState, useRef} from 'react'
import Point from '../Point/Point';
import './Board.css'
import  {
  getPoints,
  MovePiece,
  filterFirstOccurrence,
  canMakeMove,
  returnEatenPiecesHighlights,
  canReturnEatenPieces,
  canClearPieces,
  returnClearPieces,
  findClosestNumber,
  checkForWinner,
  disableMouseClick,
  enableMouseClick,
  uncheckOthers
} from '../../../scripts/GameScripts.js'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Piece from '../Piece/Piece';
import {CSSTransition} from 'react-transition-group'

const Board = ({diceResult,rollAgain,yourTurn=false,sendMove,passTurn,board, setBoard,setDiceResult,eatenPieces,setEatenPieces,gameEnded=-1,setGameEnded,rollAnimation,setRollAnimation}) => {
  
    const [highlightPieces, setHighlightPieces] = useState([])
    const [chosenPiece, setChosenPiece] = useState(0)
    // const [diceResult,setDiceResult] = useState(diceResult)
    const [turn,setTurn] = useState(0)
    // const [eatenPieces,setEatenPieces] = useState([])
    const [clearPieces,setClearPieces] = useState([])
    // const [rollAnimation,setRollAnimation] =useState(true)

     //-1 still active, 0 player 0 won, 1 player 1 won
    
    console.log(`turn: ${turn}`)

    useEffect(()=>{
      // const gifElement = document.getElementById("dice-roll-screen")
      if(yourTurn){
        setRollAnimation(true)
        setTimeout(() => {
          setRollAnimation(false)
        },3000);
      }
      return()=>{
        // if(!yourTurn){
        //   setRollAnimation(true)
        // }
      }
    },[yourTurn])
    useEffect(() => {
      if(checkForWinner(board,eatenPieces,turn)){
        setGameEnded()
        setRollAnimation(false)
        
      }
    },[board,diceResult])
    useEffect(()=>{
      if(canClearPieces(board,eatenPieces,turn)){
        setClearPieces(returnClearPieces(diceResult,turn))
      }
    },[turn,diceResult])
    useEffect(() => {
      if(eatenPieces.includes(turn)){  
        if(canReturnEatenPieces(board,diceResult,turn)){
          setHighlightPieces(returnEatenPiecesHighlights(board,diceResult,turn))
          setChosenPiece(-1)   
          toast("you have eaten pieces")
        }  
        else if(yourTurn){
          // rollAgain()
          // setTurn(turn===0?1:0)
          toast("you can't return pieces, turn passed")
          passTurn()
        }
      }
    },[eatenPieces,diceResult])
    useEffect(() => {
      console.log('999999999999999999999')
      console.log(diceResult)
      console.log(board)
      console.log(turn)
      if(!canMakeMove(board,diceResult,turn,eatenPieces)){
        // rollAgain()
        // setTurn(turn===0?1:0)
        toast("you can't make a move, turn passed")
        passTurn()
      }
      console.log(`turn: ${turn}`)
    },[diceResult])

    // useEffect(() => {
    //   setDiceResult(diceResult)
    //   toast(`rolled: ${diceResult}`)
    //   // toast(`player ${turn} turn`)
    //   // // disableMouseClick()
    //   // setTimeout(() => {
    //   //   toast(`rolled: ${diceResult}`)
    //   //   //  enableMouseClick()
    //   // }, 3000);
    // },[diceResult])

    const clickPiece = (inBoardIndex,inPointIndex) => {
      const modifier = (turn===0 ? 1:-1);
      if(inBoardIndex===-1){
        setHighlightPieces([])
        uncheckOthers(`${inBoardIndex}`)
        return
      }
      uncheckOthers(`${inBoardIndex}-${inPointIndex}`)
      setChosenPiece(inBoardIndex)
      setHighlightPieces(diceResult.map(item =>(item=inBoardIndex+(item*modifier))))
    }
    const MakeAMove = (moveTo,inBoardIndex) => {

      const [newBoard, newEatenPieces] = MovePiece(chosenPiece,moveTo,board,eatenPieces,turn,inBoardIndex)
      
      setBoard(newBoard)
      setEatenPieces(newEatenPieces)
      setHighlightPieces([])
      setClearPieces([])
      if(chosenPiece===-1){
        setDiceResult(filterFirstOccurrence(diceResult,Math.abs(turn===0?moveTo+1:23-moveTo+1)))
        console.log("5555555555555555555555555555555555")
      }
      else if(moveTo===-1){
        console.log("44444444444444444444444444")
        let num
        let position = turn===0?23-inBoardIndex+1:inBoardIndex+1
        if(diceResult.some(item => (item > position)) && diceResult.some(item => (item<position)))
          num = Math.max(...diceResult)
        else
        num=findClosestNumber(diceResult,position)
      
      setDiceResult(filterFirstOccurrence(diceResult,num))
    }
    else{
        console.log("333333333333333333333333")
        console.log(diceResult)
        console.log(moveTo)
        console.log(chosenPiece)
        console.log(filterFirstOccurrence(diceResult,Math.abs(moveTo-chosenPiece)))
        setDiceResult(filterFirstOccurrence(diceResult,Math.abs(moveTo-chosenPiece)))
      }
      sendMove(newBoard,eatenPieces) ///------------------------------------------

    }
    const startNewGame=() =>{
      setGameEnded(-1)
      setBoard(getPoints())
      setTurn(0)
      setHighlightPieces([])
      setChosenPiece(0)
      setDiceResult(diceResult)
      setEatenPieces([])
      setClearPieces([])
    }
    // console.log(`eatenPieces: ${eatenPieces}`)
    // console.log(`clearPieces: ${clearPieces}`)
    // console.log(`diceResult: ${diceMoves}`)
    // console.log("hola3")
    return (
      <>
      <div className='backgammon-board'>
            {board.map((item,index)=>(
              <Point 
              pieces={board[index < 12 ? index : board.length - (index-11)]} 
              id={index < 12 ? index : board.length - (index-11)} 
              ClickPiece={clickPiece} 
              highlight={highlightPieces.includes(index < 12 ? index : board.length - (index-11))}
              MakeAMove={MakeAMove}
              turn={turn}
              hasEatenPieces={eatenPieces.includes(turn)}
              clearHighlight={clearPieces.includes(index < 12 ? index : board.length - (index-11))}
              />
            ))}   
            <div className='eaten-pieces'>
              {eatenPieces.map((piece,index)=>(
                <Piece type={piece} inBoardIndex={-1} inPointIndex={index}  turn={turn}/>
              ))}
            </div>         
              { !yourTurn && gameEnded === -1 && <div className='opponent-turn-cover'>opponent turn</div>}
              <CSSTransition in={gameEnded === -1&&rollAnimation && yourTurn} timeout={500} classNames="rollled-animation" unmountOnExit >
                
             <div id ="dice-roll-screen" className='dice-roll-screen'>
              <img className="dice-animation" src={"../../../../images/dice-roll-dice.gif"}/>
              </div>
              </CSSTransition >
              <CSSTransition in={gameEnded === -1&&rollAnimation && yourTurn} timeout={500} classNames="rolled-animation-text" unmountOnExit >
                <div className='rolled-animation-text'>
                  <div>rolled: </div>
                  <div>{diceResult.join(",")}</div>
                </div>
              </CSSTransition>
    </div>
    {gameEnded !== -1 &&
      <div className='winner-screen'>
        <div className='end-prompt'>Player {gameEnded} won!</div>
      </div>
      
    }
    {/* <ToastContainer position='top-center' hideProgressBar={false}  theme="dark"  autoClose={2000}/> */}

      </>
  )
}

export default Board