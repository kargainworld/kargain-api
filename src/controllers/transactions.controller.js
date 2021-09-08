const TransactionModel = require('../models').Transaction

exports.addTransaction = async (req, res, next) => {
    const { announceId, hashTx, data, action } = req.body

    try {
        const transaction = new TransactionModel({
            announce: announceId,
            user: req.user,
            hashTx,
            data,
            action
        })

        const doc = await transaction.save()

        return res.json({
            success: true,
            data: doc
        })
    } catch (err) {
        return next(err)
    }
}

exports.updateTransaction = async (req, res, next) => {
    const { announce_id: announce } = req.params
    const { hashTx, status } = req.body

    try {
        const transaction = await TransactionModel.findOne({ announce, hashTx }).exec()

        transaction.status = status

        const doc = await transaction.save()

        return res.json({
            success: true,
            data: doc
        })
    } catch (err) {
        return next(err)
    }
}

exports.getTransactionsByAnnounceId = async (req, res, next) => {
    const { announce_id: announce } = req.params

    try {
        const transactions = await TransactionModel.find({ announce }).exec()

        return res.json({
            success: true,
            data: transactions
        })
    } catch (err) {
        return next(err)
    }
}