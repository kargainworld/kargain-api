const mongoose = require('mongoose')
const Errors = require('../../utils/errors')
const Messages = require('../../utils/messages')
const notificationModel = require('../../models').Notification

const postNotification = async ({
    uid,
    message,
    action,
    socket
}) => {
    try {
        if (!uid) { throw Errors.NotFoundError(Messages.errors.missing_or_invalid_email) }
        if (!message) { throw Errors.NotFoundError('missing firstname') }

        const result = await notificationModel.updateMany(
            { to: mongoose.Types.ObjectId(uid) },
            { $addToSet: { pings: { message, action, createdAt: new Date().getTime() } } },
            { runValidators: true, upsert: true }
        )

        if (socket && socket !== null) {
            getNotificationsAndCount({ userId: uid }).then(data => {
                socket.sendMessage('GET_NOTIFICATION', data, uid)
            })
        }

        return result
    } catch (error) {
        throw new Error(error.message)
    }
}

const getNotificationsAndCount = async ({ userId }) => {
    try {
        const result = await notificationModel.findOne({
            to: userId
        })
        const data = {
            data: [],
            count: 0
        }

        if (result) {
            data.data = result.pings.sort((a,b) => b.createdAt - a.createdAt);
            data.count = data.data.filter(item => !item.opened).length
        }

        return data
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    postNotification,
    getNotificationsAndCount
}
