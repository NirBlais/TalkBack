
const io = require('socket.io')(5176,{
    cors: {
        origin: ['http://localhost:5177']
    }
})

const users = {};

io.on('connection', (socket) => {
    socket.on('send-chat-message', ({message,currentUser,targetUser}) => {
        console.log(`message arrived to server:" ${message}"`)
        console.log("sending message to:"+targetUser)
        console.log("message coming from:"+currentUser)
        let recipientSocket = users[targetUser];
        if (recipientSocket) {
          const fromUser = currentUser
          recipientSocket.emit('get-chat-message', { message, fromUser });
          console.log(`im here`)
        } else {
          console.log(`im here222222`)
          socket.emit('error', 'Recipient not found');
        }
    })

    socket.on('set-username', (username) => {
        console.log(username +" connected")
        socket.username = username;
        users[username] = socket;
      });
})


