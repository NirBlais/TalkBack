
const getPoints= ()=>{
  return [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [1,1,1],
    [],
    [],
    [1,1,1,1,1,1],
    [],
    [],
    [],
    [],
    [],
    [],
    [0,0],
    [],
    [],
    [],
    [],
    [],
    []]}


    export {getPoints};

    const RollDice=()=>{
        const arr = [Math.floor(Math.random() * 6 + 1),Math.floor(Math.random() * 6 + 1)]
        // if the same number is rolled get the same number four times
        if(arr[0]===arr[1]){
            return [arr[0],arr[0],arr[0],arr[0]];
        }
        return arr;
    }
    export {RollDice};

    const MovePiece = (start, moveTo, board,eatenPieces,turn,inBoardIndex) => {
        if(moveTo===-1){/// piece is at the end
          board[inBoardIndex].pop()
          console.log("im here-----------------------------")
        }
        else{
          if(start===-1){/// -1 means the piece is in the graveyard
            eatenPieces.splice(eatenPieces.indexOf(turn),1)
            board[moveTo].push(turn)
          }
          else{
            board[moveTo].push(board[start].pop()) 
          }
          if(board[moveTo][0] !==  board[moveTo][1] && board[moveTo].length === 2 )
          {
             eatenPieces.push(board[moveTo][0])
             board[moveTo].splice(0, 1)
          }
        }
        return [board,eatenPieces]
  }

  const canClearPieces =(board,eatenPieces,turn) =>{
    let bool=true
    for(let i=(turn===0?0:6);i<(turn===0?18:24);i++){
     if(board[i][0] === turn ) bool = false
    }
    if(eatenPieces.includes(turn)) bool = false
    return bool
  }
  export {canClearPieces}

    export {MovePiece}

    const filterFirstOccurrence = (arr, num) => {
        const firstIndex = arr.indexOf(num);
        if (firstIndex !== -1) {
          return arr.filter((_, index) => index !== firstIndex);
        }
        return arr;
      }

    export {filterFirstOccurrence}

    const canMakeMove = (board,diceMoves,turn,eatenPieces)=>{
      let canClear = canClearPieces(board,eatenPieces,turn) && diceMoves.length >0 ? true : false;
      let bool = false;
      // console.log("can clear pieces: "+bool)
      const modifier = (turn===0 ? 1:-1);
      
        diceMoves.forEach(element => {
          for (let i = 0; i < board.length; i++) {
            const pointToo =i+(element*modifier)

            if(
              board[i][0]===turn && 
              ((pointToo<board.length &&
              pointToo>=0 &&
              (board[pointToo].length <=1 ||
                ( board[pointToo][0] === turn && board[pointToo][0]===board[pointToo][1])))
                 ||
              (canClear && (pointToo>=board.length || pointToo<0 )))
            )
            {
              console.log("-----------------------------------------------")
              console.log("i:"+i)
              console.log("turn"+turn)
              console.log("pointtoo:"+pointToo)
              console.log("board[pointToo]:"+board[pointToo])
              console.log("-----------------------------------------------")
              // console.log(pointToo)
              bool=true
            }
          }
          })
          console.log(`can make move: ${bool}`)
          return bool;
    }
    export {canMakeMove}
    
    const canReturnEatenPieces =(board,diceMoves,turn)=>{
      let bool = false
      if(turn===0){
        diceMoves = diceMoves.map(element => element-1)
        for(let i=0;i<=5;i++){
          if(diceMoves.includes(i)&&
            (board[i].length <=1 ||
              ( board[i][0] === turn 
                && board[i][0]===board[i][1]
              )
            ))
          {
            bool=true
          }
        }
      }
      else if(turn ===1){
        diceMoves = diceMoves.map(element => 23-element+1)
        for(let i=23;i>=18;i--){
          if(diceMoves.includes(i)&&
            (board[i].length <=1 ||
              ( board[i][0] === turn 
                && board[i][0]===board[i][1]
              )
            ))
          {
            bool=true
          }
        }

      }
      return bool
    }
    export {canReturnEatenPieces}

    const returnEatenPiecesHighlights = (board,diceMoves,turn) =>{
      const highlights= []
      if(turn===0){
        diceMoves = diceMoves.map(element => element-1)
        for(let i=0;i<=5;i++){
          if(diceMoves.includes(i)&&
          (board[i].length <=1 ||
            ( board[i][0] === turn 
              && board[i][0]===board[i][1]
            )
          ))
          {
            highlights.push(i)
          }
        }
      }
      else if(turn ===1){
        diceMoves = diceMoves.map(element => 23-element+1)
        for(let i=23;i>=18;i--){
          if(diceMoves.includes(i)&&
            (board[i].length <=1 ||
              ( board[i][0] === turn 
                && board[i][0]===board[i][1]
              )
            ))
          {
            highlights.push(i)
          }
        }

      }
      return highlights
    }
    export {returnEatenPiecesHighlights}



    const returnClearPieces =(diceMoves,turn)=>{
      let arr=[]
      let highestDiceMove= Math.max(...diceMoves)
      console.log("highestDiceMove: "+highestDiceMove)
      if (turn===0){
        for(let i=24-highestDiceMove;i<=23;i++){
          arr.push(i)
        }
      }
      else{
        for(let i=highestDiceMove-1;i>=0;i--){
          arr.push(i)
        }
      }
      return arr

    }

    export {returnClearPieces}

    function findClosestNumber(array, target) {
      return array.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
      )
    }
    export {findClosestNumber}

    const checkForWinner = (board,eatenPieces,turn)=>{
     let bool = true
     board.forEach(item => {
      if(item[0]===turn) bool=false
    })
    eatenPieces.forEach(item=>{
      if(item===turn) bool=false
    })
    return bool
    }
    export {checkForWinner}

    const RollForStart = () =>{
      const arr =  [Math.floor(Math.random() * 6 + 1),Math.floor(Math.random() * 6 + 1)]
      if(arr[0]===arr[1]) return RollForStart()
      return arr
    }
    export {RollForStart}


    // Function to disable mouse clicking
function disableMouseClick() {
  // Prevent default behavior for mouse events
  function preventDefault(e) {
      e.preventDefault();
      e.stopPropagation();
  }

  // Add event listeners to disable mouse events
  window.addEventListener('mousedown', preventDefault, true);
  window.addEventListener('mouseup', preventDefault, true);
  window.addEventListener('click', preventDefault, true);
  window.addEventListener('dblclick', preventDefault, true);
}
export {disableMouseClick}

// Function to enable mouse clicking
async function enableMouseClick() {
  // Remove event listeners to enable mouse events
  window.removeEventListener('mousedown', preventDefault, true);
  window.removeEventListener('mouseup', preventDefault, true);
  window.removeEventListener('click', preventDefault, true);
  window.removeEventListener('dblclick', preventDefault, true);
}

export {enableMouseClick}


function uncheckOthers(elementId) {
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if(checkbox.id !== `${elementId}`){
      checkbox.checked = false    
    }    
  });
  // console.log('inBoardIndex ===  :' + inBoardIndex)
}

export {uncheckOthers}


const FlipBoard = (board) =>{
  
  for (let i = 0; i < board.length / 2; i++) {
    let temp = board[i];
    board[i] = board[board.length - 1 - i];
    board[board.length - 1 - i] = temp;
  }
  for(let i = 0 ; i< board.length; i++){
    for(let j = 0; j<board[i].length; j++){
      if(board[i][j]===0) board[i][j]=1
      else if(board[i][j]===1) board[i][j]=0
    }
  }

return board;
}
export {FlipBoard}

const FlipEatenPieces =(eatenPieces) =>{
  for(let i=0;i<eatenPieces.length;i++){
    if(eatenPieces[i]===0) eatenPieces[i] = 1
    else if(eatenPieces[i]===1) eatenPieces[i] = 0
  }
  return eatenPieces
}

export {FlipEatenPieces}