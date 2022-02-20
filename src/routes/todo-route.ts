import { Router } from 'express'
import * as taskController from '../controllers/todo-controller'
import * as middlewares from '../utils/authen'

const router = Router()

router.post('/add', middlewares.authen, taskController.handleAddTask)
router.put('/update/:id', middlewares.authen, taskController.handleUpdateTask)
router.delete('/remove/:id', middlewares.authen, taskController.handleRemoveTask)
router.get('/', middlewares.authen, taskController.handleGetAllTasks)
router.get('/:id', middlewares.authen, taskController.handleGetTaskById)
router.post('/assign/:id', middlewares.authen, taskController.handleAssignTask)

export default router