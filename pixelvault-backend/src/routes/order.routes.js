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
// GET /:id/invoice requiere un usuario autenticado: downloadOrderInvoice()
// del frontend envía el token vía header Authorization: Bearer.
router.get('/:id/invoice', requireAuth, validateObjectId(), asyncHandler(controller.getOrderInvoice))
router.put('/:id', requireAdmin, validateObjectId(), asyncHandler(controller.updateOrder))
router.delete('/:id', requireAdmin, validateObjectId(), asyncHandler(controller.deleteOrder))

module.exports = router