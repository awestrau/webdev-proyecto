const express = require('express')

const controller = require('../controllers/user.controller')
const validateObjectId = require('../middleware/validateObjectId.middleware')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(controller.listUsers))
router.post('/', asyncHandler(controller.createUser))
router.get('/:id', validateObjectId(), asyncHandler(controller.getUser))
router.put('/:id', validateObjectId(), asyncHandler(controller.updateUser))
router.patch(
  '/:id/password',
  validateObjectId(),
  asyncHandler(controller.updateUserPassword),
)
router.delete('/:id', validateObjectId(), asyncHandler(controller.deleteUser))

module.exports = router