const express = require('express')

const controller = require('../controllers/order.controller')
const { requireAdmin, requireAuth } = require('../middleware/auth.middleware')
const validateObjectId = require('../middleware/validateObjectId.middleware')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', requireAdmin, asyncHandler(controller.listOrders))
// POST / requiere un usuario autenticado: la orden se registra siempre a
// nombre del usuario del token (request.user.id).
router.post('/', requireAuth, asyncHandler(controller.createOrder))
router.get('/:id', requireAdmin, validateObjectId(), asyncHandler(controller.getOrder))
router.put('/:id', requireAdmin, validateObjectId(), asyncHandler(controller.updateOrder))
router.delete('/:id', requireAdmin, validateObjectId(), asyncHandler(controller.deleteOrder))

module.exports = router