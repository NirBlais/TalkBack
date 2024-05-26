import React, { useEffect } from 'react'
import './Point.css'
import { useState } from 'react'
import Piece from '../Piece/Piece'


const Point = ({pieces,id,ClickPiece,highlight,MakeAMove,turn,hasEatenPieces,clearHighlight}) => {
    return (
    <>
        <div className='point' >
            {/* <div className='id'>{id}</div> */}

            <div className='pieces'>
            {(highlight && pieces.length===0) ? 
                (                                                  
                    <Piece type={2} ClickPiece={ClickPiece}  inBoardIndex={id} MakeAMove={MakeAMove} turn={turn} />
                ):
                (
                    <>
                    {pieces.map((piece,index) => (
                        index<5 &&
                        <Piece type={(clearHighlight && piece===turn) ? 3 : piece} inBoardIndex={id} inPointIndex={index} ClickPiece={ClickPiece} MakeAMove={MakeAMove} turn={turn} isActive={!hasEatenPieces}>
                            {(index===4 && pieces.length>5) && `+${pieces.length-5}`}
                        </Piece>
                    ))}
                    {(highlight && (turn===pieces[0] || pieces.length===1)) && <Piece type={2} MakeAMove={MakeAMove} inBoardIndex={id} ClickPiece={ClickPiece} turn={turn}/> }
                    </>               
                                  
                )}
            </div>
        </div>
    </>
  )
}

export default Point;