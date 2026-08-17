const express = require('express')

const controller = require('../controllers/promotionCode.controller')
const validateObjectId = require('../middleware/validateObjectId.middleware')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(controller.listPromotionCodes))
router.post('/', asyncHandler(controller.createPromotionCode))
router.get('/:id', validateObjectId(), asyncHandler(controller.getPromotionCode))
router.put('/:id', validateObjectId(), asyncHandler(controller.updatePromotionCode))
router.delete('/:id', validateObjectId(), asyncHandler(controller.deletePromotionCode))

module.exports = router
