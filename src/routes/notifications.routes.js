const cors = require('cors')
const router = require('express').Router()
const passportMiddleware = require('../middlewares/passport')
const corsMiddleware = require('../middlewares/cors.middleware')
const notificationsController = require('../controllers/notifications.controller')


router.get('/' )
router.get('/',
    corsMiddleware.manualCors,
    passportMiddleware.authenticate('cookie', { session: false }),
    notificationsController.getCurrentUserNotifications
)
router.options('/:notificationId', cors(corsMiddleware.clientCors))
router.delete('/:notificationId',
    corsMiddleware.manualCors,
    passportMiddleware.authenticate('cookie', { session: false }),
    notificationsController.deleteCurrentUserNotifications
)

module.exports = router
