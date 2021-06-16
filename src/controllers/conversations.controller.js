const Errors = require('../utils/errors')
const Messages = require('../utils/messages')
const ConversationModel = require('../models').Conversation

exports.getCurrentUserConversations = async (req, res, next) => {
    if (!req.user) { return next(Errors.UnAuthorizedError(Messages.errors.user_not_found)) }

    try {
        const conversations = await ConversationModel.find(
            {
                $or: [
                    { from: req.user.id },
                    { to: req.user.id }
                ]
            })
            .populate({
                path: 'from',
                select: 'avatarUrl firstname username lastname email'
            })
            .populate({
                path: 'to',
                select: 'avatarUrl firstname username lastname email'
            })

        return res.json({
            success: true,
            data: conversations
        })
    } catch (err) {
        return next(err)
    }
}

exports.getConversationsWithProfile = async (req, res, next) => {
    if (!req.user) { return next(Errors.UnAuthorizedError(Messages.errors.user_not_found)) }

    const { profileId } = req.params

    try {
        const conversation = await ConversationModel.findOne(
            {
                $or: [
                    {
                        from: req.user.id,
                        to: profileId
                    },
                    {
                        from: profileId,
                        to: req.user.id
                    }
                ]
            })
            .populate({
                path: 'from',
                select: 'avatarUrl firstname username lastname email'
            })
            .populate({
                path: 'to',
                select: 'avatarUrl firstname username lastname email'
            })

        return res.json({
            success: true,
            data: conversation
        })
    } catch (err) {
        return next(err)
    }
}

exports.postConversationMessage = async (req, res, next) => {
    const { message, recipientId } = req.body

    if (!req.user) { return next(Errors.UnAuthorizedError(Messages.errors.user_not_found)) }
    if (!recipientId) { return next(Errors.UnAuthorizedError(Messages.errors.user_not_found)) }

    try {
        const conversation = await ConversationModel.findOneAndUpdate(
            {
                $or: [
                    {
                        from: req.user.id,
                        to: recipientId
                    },
                    {
                        from: recipientId,
                        to: req.user.id
                    }
                ]
            },
            {
                from: req.user.id,
                to: recipientId,
                $push: {
                    messages: {
                        from: req.user.id,
                        content: message,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                }
            },
            {
                new: true,
                upsert: true
            })
            .populate({
                path: 'from',
                select: 'avatarUrl firstname username lastname email'
            })
            .populate({
                path: 'to',
                select: 'avatarUrl firstname username lastname email'
            })

        return res.json({
            success: true,
            data: conversation
        })
    } catch (err) {
        return next(err)
    }
}

exports.postConversationMessageFromSocket = async (from, to, message) => {

    if (!from) { throw new Error(Errors.UnAuthorizedError(Messages.errors.user_not_found)) }
    if (!to) { throw new Error(Errors.UnAuthorizedError(Messages.errors.user_not_found)) }

    try {
        const conversation = await ConversationModel.findOneAndUpdate(
            {
                $or: [
                    {
                        from: from,
                        to: to
                    },
                    {
                        from: to,
                        to: from
                    }
                ]
            },
            {
                from: from,
                to: to,
                $push: {
                    messages: {
                        from: from,
                        content: message,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                }
            },
            {
                new: true,
                upsert: true
            })
            .populate({
                path: 'from',
                select: 'avatarUrl firstname username lastname email'
            })
            .populate({
                path: 'to',
                select: 'avatarUrl firstname username lastname email'
            })

        return true
    } catch (err) {
        throw new Error(err)
    }
}
