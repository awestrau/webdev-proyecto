const express = require('express')

const controller = require('../controllers/order.controller')
const validateObjectId = require('../middleware/validateObjectId.middleware')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(controller.listOrders))
router.post('/', asyncHandler(controller.createOrder))
router.get('/:id', validateObjectId(), asyncHandler(controller.getOrder))
router.put('/:id', validateObjectId(), asyncHandler(controller.updateOrder))
router.delete('/:id', validateObjectId(), asyncHandler(controller.deleteOrder))

module.exports = router