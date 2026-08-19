const express = require('express')

const controller = require('../controllers/promotionCode.controller')
const { requireAdmin } = require('../middleware/auth.middleware')
const validateObjectId = require('../middleware/validateObjectId.middleware')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(controller.listPromotionCodes))
router.post('/', requireAdmin, asyncHandler(controller.createPromotionCode))
router.get('/:id', validateObjectId(), asyncHandler(controller.getPromotionCode))
router.put(
  '/:id',
  requireAdmin,
  validateObjectId(),
  asyncHandler(controller.updatePromotionCode),
)
router.delete(
  '/:id',
  requireAdmin,
  validateObjectId(),
  asyncHandler(controller.deletePromotionCode),
)

module.exports = router
