import express from 'express'
import { createTaskController, deleteTaskController, getAllTasksController, getTaskByIdController, updateTaskController } from '../controllers/task.controller'

const router = express.Router()

router.post('/project/:projectId/workspace/:workspaceId/create',createTaskController)
router.delete('/:id/workspace/:workspaceId/delete',deleteTaskController)
router.put('/:id/project/:projectId/workspace/:workspaceId/update',updateTaskController)
router.get('/workspace/:workspaceId/all',getAllTasksController)
router.get('/:id/project/:projectId/workspace/:workspaceId',getTaskByIdController)


export default router