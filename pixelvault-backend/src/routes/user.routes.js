const express = require('express')

const controller = require('../controllers/user.controller')
const { requireAdmin } = require('../middleware/auth.middleware')
const validateObjectId = require('../middleware/validateObjectId.middleware')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', requireAdmin, asyncHandler(controller.listUsers))
router.post('/', asyncHandler(controller.createUser))
router.post('/admin', requireAdmin, asyncHandler(controller.createAdminUser))
router.get('/:id', requireAdmin, validateObjectId(), asyncHandler(controller.getUser))
router.put('/:id', requireAdmin, validateObjectId(), asyncHandler(controller.updateUser))
router.patch(
  '/:id/password',
  requireAdmin,
  validateObjectId(),
  asyncHandler(controller.updateUserPassword),
)
router.delete('/:id', requireAdmin, validateObjectId(), asyncHandler(controller.deleteUser))

module.exports = router