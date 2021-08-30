const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    announce: {
        type: String,
        ref: 'Announce'
    },

    hashTx: {
        type: String,
        trim: true,
        unique: true
    },

    status: {
        type: String,
        enum: ['Approved', 'Pending', 'Rejected'],
        default: 'Pending'
    },

    data: {
        type: String,
        trim: true
    },

    action: {
        type: String,
        enum: ['TokenMinted', 'OfferCreated', 'OfferAccepted', 'OfferRejected']
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: {
        virtuals: true
    },
    strict: false
})

TransactionSchema.plugin(require('mongoose-autopopulate'))

module.exports = TransactionSchema
