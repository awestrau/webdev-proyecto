const express = require('express')

const controller = require('../controllers/cart.controller')
const validateObjectId = require('../middleware/validateObjectId.middleware')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get(
  '/by-user/:userId',
  validateObjectId('userId'),
  asyncHandler(controller.getCartByUser),
)
router.delete(
  '/by-user/:userId',
  validateObjectId('userId'),
  asyncHandler(controller.clearCartByUser),
)

router.get('/', asyncHandler(controller.listCarts))
router.post('/', asyncHandler(controller.createCart))
router.get('/:id', validateObjectId(), asyncHandler(controller.getCart))
router.put('/:id', validateObjectId(), asyncHandler(controller.updateCart))
router.delete('/:id', validateObjectId(), asyncHandler(controller.deleteCart))

module.exports = router