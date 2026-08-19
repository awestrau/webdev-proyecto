const express = require('express')

const controller = require('../controllers/cart.controller')
const { requireAdmin, requireAuth } = require('../middleware/auth.middleware')
const validateObjectId = require('../middleware/validateObjectId.middleware')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get(
  '/by-user/:userId',
  requireAdmin,
  validateObjectId('userId'),
  asyncHandler(controller.getCartByUser),
)
router.delete(
  '/by-user/:userId',
  requireAdmin,
  validateObjectId('userId'),
  asyncHandler(controller.clearCartByUser),
)

router.get('/', requireAdmin, asyncHandler(controller.listCarts))
// POST / (createCart) y PUT /:id (updateCart) requieren un usuario autenticado:
// el carrito se crea/edita siempre sobre el usuario del token (request.user.id).
router.post('/', requireAuth, asyncHandler(controller.createCart))
router.get('/:id', requireAdmin, validateObjectId(), asyncHandler(controller.getCart))
router.put('/:id', requireAuth, validateObjectId(), asyncHandler(controller.updateCart))
router.delete('/:id', requireAdmin, validateObjectId(), asyncHandler(controller.deleteCart))

module.exports = router
