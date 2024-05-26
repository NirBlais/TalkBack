// import { RollForStart } from './GameScripts.js';
const RollForStart = require('./GameScripts.js')
const io = require('socket.io')(5178,{
    cors: {
        origin: ['http://localhost:5177']
    }
})

const users = {};

io.on('connection', (socket) => {
    socket.on('send-game-move', ({message,currentUser,targetUser}) => {
        // console.log(`message arrived to server:" ${message}"`)
        // console.log("sending message to:"+targetUser)
        // console.log("message coming from:"+currentUser)
        let recipientSocket = users[targetUser];
        if (recipientSocket) {
          const fromUser = currentUser
          recipientSocket.emit('get-game-move', { message, fromUser });
        //   console.log(`im here`)
        } else {
        //   console.log(`im here222222`)
          socket.emit('error', 'Recipient not found');
        }
    })
    socket.on('start-game', ({currentUser,targetUser}) => {
        const diceRolls = RollForStart();// 0 -currentuser, 1 -targetuser
        let currentSocket = users[currentUser];
        let targetSocket = users[targetUser];
        console.log("game had started------------------------")
        console.log(`currentUser:${currentUser}----targetUser:${targetUser}`)
        if (currentSocket && targetSocket) {
          console.log("game had started22222------------------------")

          currentSocket.emit('first-move', {diceRolls:`${currentUser} rolled: ${diceRolls[0]},${targetUser} rolled: ${diceRolls[1]}` ,isBeginner:diceRolls[0]>diceRolls[1]?true:false});
          targetSocket.emit('first-move', {diceRolls:`${currentUser} rolled: ${diceRolls[0]},${targetUser} rolled: ${diceRolls[1]}` ,isBeginner:diceRolls[0]<diceRolls[1]?true:false });
        }
    })


    socket.on('send-open-game', ({currentUser,targetUser}) => {
      let recipientSocket = users[targetUser];
      console.log("send open game ---------------targetuser:"+targetUser)
      if (recipientSocket) {
        console.log("send open game ---------------imhere")
        const fromUser = currentUser
        recipientSocket.emit('open-game', {fromUser });
        // startGame(currentUser,targetUser)
        // socket.emit('start-game', {currentUser,targetUser});
      //   console.log(`im here`)
      } else {
      //   console.log(`im here222222`)
        socket.emit('error', 'Recipient not found');
      }
    })
    

    socket.on('send-game-request', ({currentUser,targetUser}) => {
      console.log("im here----------------------")
      console.log("targetuser:"+targetUser)
      let recipientSocket = users[targetUser];
      if (recipientSocket) {
        console.log("im here222----------------------")
        const fromUser = currentUser
        recipientSocket.emit('get-game-request', {fromUser });
      //   console.log(`im here`)
      }
    })
        // console.log(`message arrived to server:" ${message}"`))
    socket.on('send-move',({newBoard,newEatenPieces,fromUser,targetUser})=>{
      let recipientSocket = users[targetUser];
      if (recipientSocket) {
        recipientSocket.emit('get-move', {newBoard,newEatenPieces,fromUser });
      }
    })
    socket.on('pass-turn',({fromUser,targetUser})=>{
      let recipientSocket = users[targetUser];
      if (recipientSocket) {
        recipientSocket.emit('get-pass-turn', {fromUser });
      }
    })
    socket.on('set-username', (username) => {
        console.log(username +" connected")
        socket.username = username;
        users[username] = socket;
      });

      socket.on("send-forfeit",({fromUser,targetUser})=>{
        let recipientSocket = users[targetUser];
        if (recipientSocket) {
          recipientSocket.emit('get-forfeit', {fromUser});
        }
      })

      socket.on("send-winner",({fromUser,targetUser})=>{
        let recipientSocket = users[targetUser];
        if (recipientSocket) {
          recipientSocket.emit('get-winner', {fromUser});
        }
      })
})


