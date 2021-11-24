const express = require('express')
const cors = require('cors')
const routes = express.Router()
const passportMiddleware = require('../middlewares/passport')
const transactionsController = require('../controllers/transactions.controller')
const corsMiddleware = require('../middlewares/cors.middleware')
const rolesMiddleware = require('../middlewares/roles.middleware')


routes.options('/add', cors(corsMiddleware.authedCors)) // enable pre-flights
routes.post('/add',
    corsMiddleware.manualCors,
    passportMiddleware.authenticate('cookie', { session: false }),
    transactionsController.addTransaction
)

routes.options('/:announce_id/update', cors(corsMiddleware.authedCors)) // enable pre-flights
routes.put('/:announce_id/update',
    corsMiddleware.manualCors,
    passportMiddleware.authenticate('cookie', { session: false }),
    transactionsController.updateTransaction
)

routes.options('/:announce_id', cors(corsMiddleware.authedCors)) // enable pre-flights
routes.get('/:announce_id',
    corsMiddleware.manualCors,
    // passportMiddleware.authenticate('cookie', { session: false }),
    // rolesMiddleware.grantAccess('readAny', 'announce'),
    transactionsController.getTransactionsByAnnounceId
)

module.exports = routes
