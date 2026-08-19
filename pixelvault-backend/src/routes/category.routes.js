const express = require('express')

const controller = require('../controllers/category.controller')
const validateObjectId = require('../middleware/validateObjectId.middleware')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(controller.listCategories))
router.post('/', asyncHandler(controller.createCategory))
router.get('/:id', validateObjectId(), asyncHandler(controller.getCategory))
router.put('/:id', validateObjectId(), asyncHandler(controller.updateCategory))
router.delete('/:id', validateObjectId(), asyncHandler(controller.deleteCategory))

module.exports = router