const Server = require('socket.io')


// class Sockets {
//     constructor(httpServer) {
// this._io = Server(httpServer, )

//         this._io.on('connection', socket => {
//             console.log("Connection")
//         })
//     }
// }

// module.exports = new Sockets()

Socket = {}

Socket.init = (httpServer) => {
    Socket.io = Server(httpServer, {
        cors: {
            origins: ['http://localhost:3000', 'https://kargain.com'],
            methods: ["GET", "POST"]
        }
    })

    Socket.io.on('connection', (socket) => {
        socket.emit('PING', 'FROM SERVER')
        socket.on('SET_USER_ID', data => {
            socket.userId = data.id
        })
    })
}

Socket.sendMessage = (msgType, msg, userId) => {
    const sockets = CheckSockets()
    sockets.some(socket => {
        if (socket.userId === userId) {
            socket.emit(msgType, msg)
        }
        return socket.userId == userId
    })
}

const CheckSockets = () => {
    if (Socket.io && Socket.io.sockets && Socket.io.sockets.sockets) return Socket.io.sockets.sockets
    return []
}

module.exports = Socket