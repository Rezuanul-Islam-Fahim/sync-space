import express from 'express'
import * as authController from '../controllers/auth-controller.js'
import { registerValidation, validate } from '../../middlewares/validators.js'

const router = express.Router()

router.post('/register', registerValidation, validate, authController.register)

export default router
