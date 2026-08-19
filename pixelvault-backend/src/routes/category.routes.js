const express = require('express')

const controller = require('../controllers/category.controller')
const { requireAdmin } = require('../middleware/auth.middleware')
const validateObjectId = require('../middleware/validateObjectId.middleware')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(controller.listCategories))
router.post('/', requireAdmin, asyncHandler(controller.createCategory))
router.get('/:id', requireAdmin, validateObjectId(), asyncHandler(controller.getCategory))
router.put('/:id', requireAdmin, validateObjectId(), asyncHandler(controller.updateCategory))
router.delete('/:id', requireAdmin, validateObjectId(), asyncHandler(controller.deleteCategory))

module.exports = router