const Errors = require('../utils/errors')
const Messages = require('../utils/messages')
const notificationModel = require('../models').Notification
var mongoose = require('mongoose');

exports.getCurrentUserNotifications = async (req, res, next) => {
    if (!req.user) { return next(Errors.UnAuthorizedError(Messages.errors.user_not_found)) }
    try {
        const notifications = await notificationModel.findOne({ to: req.user.id })

        return res.json({
            success: true,
            data: notifications
        })
    } catch (err) {
        next(err)
    }
}

exports.deleteCurrentUserNotifications = async (req, res, next) => {
    if (!req.user) { return next(Errors.UnAuthorizedError(Messages.errors.user_not_found)) }
    const { notificationId } = req.params
    console.log(notificationId)
    try {
        // const notifications = await notificationModel.delet({ to: req.user.id }, { $pull: { 'pings._id': {$in: [notificationId]}} })
        let notification = await notificationModel.findOne({to: req.user.id})
        if(!notification) return next('No Data')
        
        let pings = notification.pings.filter(ping => {
            return ping._id.toString() !== notificationId
        })

        await notificationModel.updateOne({to: req.user.id}, {pings})        

        return res.json({
            success: true,
            data: {
                id: notificationId
            }
        })

    } catch (err) {
        console.log(err)
        next(err)
    }
}
