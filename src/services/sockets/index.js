const Server = require('socket.io')
const notificationsController = require('../../controllers/notifications.controller')
const conversationsController = require('../../controllers/conversations.controller')
const notifier = require('../../components/notifications/notifier')

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
        socket.join(socket.userId)
        next()
    })

    Socket.io.on('connection', (socket) => {
        console.log('Connected', socket.handshake.auth)
        // Socket.io.broadcast.emit('SET_ONLINE_STATUS',)
        Socket.sendBroadCast('SET_ONLINE_STATUS', socket)
        socket.emit('PING', 'FROM SERVER')

        socket.on('connect_error', (err) => {
            console.error(err)
        })

        socket.on('OPENED_NOTIFICATION', () => {
            notificationsController.setOpenNotification({ id: socket.userId })
        })

        socket.on('disconnect', () => {
            Socket.sendBroadCast('SET_OFFLINE_STATUS', socket)
        })

        socket.on('PRIVATE_MESSAGE', async ({ message, to }) => {
            try {
                const result = await conversationsController.postConversationMessageFromSocket(socket.userId, to, message)
                if (result) {
                    socket.to(to).emit('PRIVATE_MESSAGE', {
                        content: message,
                        from: socket.userId
                    })
                }
                // console.log(this)
                notifier.postNotification({ uid: to, message, action: '', socket })
            } catch (error) {
                console.trace(error)
            }

        })
    })
}

Socket.sendBroadCast = (type, target) => {
    target.broadcast.emit(type, target.userId)
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