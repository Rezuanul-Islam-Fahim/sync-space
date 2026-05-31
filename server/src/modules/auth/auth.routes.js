import express from 'express'
import * as authController from './auth.controller.js'
import { registerValidation } from './auth.validator.js'
import { validate } from '../../common/validator.js'

const router = express.Router()

router.post(
    '/register',
    registerValidation,
    validate,
    authController.register
)

export default router
