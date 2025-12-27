import express from 'express'
import * as authController from '../controllers/auth-controller.js'
import { registerValidation } from '../validators/auth.validator.js'
import { validate } from '../validators/index.js'

const router = express.Router()

router.post(
    '/register',
    registerValidation,
    validate,
    authController.register
)

export default router
