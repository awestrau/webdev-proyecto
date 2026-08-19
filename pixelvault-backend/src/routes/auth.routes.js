const express = require('express')

const controller = require('../controllers/auth.controller')
const { requireAuth } = require('../middleware/auth.middleware')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.post('/login', asyncHandler(controller.login))
router.get('/me', requireAuth, asyncHandler(controller.me))

module.exports = router