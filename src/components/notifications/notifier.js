const mongoose = require('mongoose')
const Errors = require('../../utils/errors')
const Messages = require('../../utils/messages')
const notificationModel = require('../../models').Notification

const postNotification = ({
    uid,
    message,
    action
}) => {
    return new Promise((resolve, reject) => {
        if (!uid) { reject(Errors.NotFoundError(Messages.errors.missing_or_invalid_email)) }
        if (!message) { reject(Errors.NotFoundError('missing firstname')) }

        const result = notificationModel.updateMany(
            { to: mongoose.Types.ObjectId(uid) },
            { $addToSet: { pings: { message, action } } },
            { runValidators: true, upsert: true }
        )

        return resolve(result)
    })
}

const getNotificationsAndCount = async ({userId}) => {
    try {
        const result = await notificationModel.findOne({
            to: userId
        })
        const data = {
            data: [],
            count: 0
        }
        
        if(result) {
            data.data = result.pings;
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
