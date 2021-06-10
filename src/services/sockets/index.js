const Server = require('socket.io')
const notificationsController = require('../../controllers/notifications.controller')

Socket = {}
Socket.ids = new Array()

Socket.init = (httpServer) => {
    Socket.io = Server(httpServer, {
        cors: {
            origins: ['http://localhost:3000', 'https://kargain.com'],
            methods: ["GET", "POST"]
        }
    })

    Socket.io.use((socket, next) => {
        const userId = socket.handshake.auth.userId
        if (!userId) {
            return next(new Error("Invalid userId"))
        }

        socket.userId = userId
        next()
    })

    Socket.io.on('connection', (socket) => {
        console.log('Connected', socket.handshake.auth)

        socket.emit('PING', 'FROM SERVER')

        socket.on('connect_error', (err) => {
            console.error(err)
        })

        socket.on('OPENED_NOTIFICATION', () => {
            notificationsController.setOpenNotification({ id: socket.userId })
        })
    })
}

Socket.sendMessage = (msgType, msg, userId) => {
    const sockets = CheckSockets()
    if (!userId) return
    sockets.forEach((socket) => {
        console.log(socket.userId)
        if (socket.userId == userId) {
            console.log(socket.userId, userId)
            socket.emit(msgType, msg)
        }
    })
}

const CheckSockets = () => {
    if (Socket.io && Socket.io.sockets && Socket.io.sockets.sockets) return Socket.io.sockets.sockets
    return []
}

module.exports = Socket