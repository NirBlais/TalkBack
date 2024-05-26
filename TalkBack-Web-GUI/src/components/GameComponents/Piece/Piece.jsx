import React from 'react'
import './Piece.css'
import { useState } from 'react'


//types: 0- white, 1- black, 2-highlight
const Piece = ({inBoardIndex,inPointIndex,type,ClickPiece,MakeAMove,turn,isActive,children}) => {
    const [checked,setChecked] = useState(false)
    const ShowOptions = () => {     
        // console.log(`turn: ${turn}`)
        if(!checked)
        {
            ClickPiece(inBoardIndex,inPointIndex)
            setChecked(true)
        }              
        else 
        {
            ClickPiece(-1)
            setChecked(false)
        }     

    }
    const ChooseHighlight = () => {   
        // if(type===3) ClickPiece(inBoardIndex,inPointIndex)
        MakeAMove(((type===3)? -1 : inBoardIndex),inBoardIndex)
    }
  return (
    <>
        {(type===2) ? 
            (                                                  
                <div className='highlighted-piece' onClick={() => ChooseHighlight()}></div> 
            ):
            (
                (type===3) ?
                (
                    <div className='highlighted-clear-piece' onClick={() => ChooseHighlight()}></div>                           
                ):
                (
                <div className='container'>
                    {(turn===type && isActive) && <input type='checkbox' id={`${inBoardIndex}-${inPointIndex}`} inBoardIndex={inBoardIndex} className='checkbox' onChange={() =>ShowOptions()}/>}
                    <div className={type===0 ? 'player piece': 'opponent piece'}>{children}</div>
                </div>                              
                )
            )           
        }
</>
  )
}

export default Piece