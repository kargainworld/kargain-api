const mongoose = require('mongoose')
const TransactionSchema = require('../schemas/transaction.schema')
const TransactionModel = mongoose.model('Transaction', TransactionSchema)

TransactionModel.on('index', function (err) {
    if(err){
        console.log('error building indexes: ' + err)
    }
})

module.exports = TransactionModel
