const express = require('express')

const controller = require('../controllers/shippingOption.controller')
const { requireAdmin } = require('../middleware/auth.middleware')
const validateObjectId = require('../middleware/validateObjectId.middleware')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(controller.listShippingOptions))
router.post('/', requireAdmin, asyncHandler(controller.createShippingOption))
router.get('/:id', validateObjectId(), asyncHandler(controller.getShippingOption))
router.put(
  '/:id',
  requireAdmin,
  validateObjectId(),
  asyncHandler(controller.updateShippingOption),
)
router.delete(
  '/:id',
  requireAdmin,
  validateObjectId(),
  asyncHandler(controller.deleteShippingOption),
)

module.exports = router
