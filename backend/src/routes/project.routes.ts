import express from 'express'

const router = express.Router()

router.post('/workspace/:workspaceId/create',createProjectController)
router.put('/:id/workspace/:workspaceId/update',updateProjectController)
router.delete('/:id/workspace/:workspaceId/delete',deleteProjectController)
router.get('/workspace/:workspaceId/all',getAllProjectsController)
router.get('/:id/workspace/:workspaceId/analytics',getProjectAnalyticsController)
router.get('/:id/workspace/:workspaceId',getProjectByIdController)

export default router