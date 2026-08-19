const express = require('express')

const {
  createProduct,
  deactivateProduct,
  getProduct,
  listProducts,
  streamProductImage,
  updateProduct,
  updateProductStatus,
} = require('../controllers/product.controller')
const uploadProductImages = require('../middleware/upload.middleware')
const { requireAdmin } = require('../middleware/auth.middleware')
const validateObjectId = require('../middleware/validateObjectId.middleware')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(listProducts))
router.post('/', requireAdmin, uploadProductImages, asyncHandler(createProduct))

router.get(
  '/images/:imageId',
  validateObjectId('imageId'),
  asyncHandler(streamProductImage),
)

router.get('/:id', validateObjectId(), asyncHandler(getProduct))
router.put(
  '/:id',
  requireAdmin,
  validateObjectId(),
  uploadProductImages,
  asyncHandler(updateProduct),
)
router.patch(
  '/:id/status',
  requireAdmin,
  validateObjectId(),
  asyncHandler(updateProductStatus),
)
router.delete(
  '/:id',
  requireAdmin,
  validateObjectId(),
  asyncHandler(deactivateProduct),
)

module.exports = router
