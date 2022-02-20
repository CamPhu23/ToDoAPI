import { Router } from 'express'
import * as userController from '../controllers/user-controller'
import * as middlewares from '../utils/authen'

const router = Router()

router.post('/sign-in', userController.handleLogin)
router.post('/sign-up', userController.handleRegister)
router.get('/', middlewares.authen, userController.handleGetAllUsers)
router.get('/all-assigned/:userId', middlewares.authen, userController.handleGetAllAssigned)

export default router