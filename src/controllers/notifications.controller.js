const Errors = require('../utils/errors')
const Messages = require('../utils/messages')
const notificationModel = require('../models').Notification

exports.getCurrentUserNotifications = async (req, res, next) => {
    if (!req.user) { return next(Errors.UnAuthorizedError(Messages.errors.user_not_found)) }
    try {
        const notifications = await notificationModel.findOne({ to: req.user.id })
        const data = {
            ...notifications,
            pings: notifications.pings.sort((a,b) => b.createdAt - a.createdAt)
        }
        return res.json({
            success: true,
            data: data
        })
    } catch (err) {
        next(err)
    }
}

exports.deleteCurrentUserNotifications = async (req, res, next) => {
    if (!req.user) { return next(Errors.UnAuthorizedError(Messages.errors.user_not_found)) }
    const { notificationId } = req.params

    try {
        let notification = await notificationModel.findOne({ to: req.user.id })
        if (!notification) return next('No Data')

        let pings = notification.pings.filter(ping => {
            return ping._id.toString() !== notificationId
        })

        await notificationModel.updateOne({ to: req.user.id }, { pings })

        return res.json({
            success: true,
            data: {
                id: notificationId,
                count: 1
            }
        })

    } catch (err) {
        console.log(err)
        next(err)
    }
}

exports.setOpenNotification = async ({ id }) => {
    if (!id) return Messages.errors.user_not_found

    try {
        await notificationModel.updateMany({ to: id, 'pings.opened': false }, { $set: { 'pings.$[].opened': true } })
    } catch (err) {
        console.log(err)
    }
}
