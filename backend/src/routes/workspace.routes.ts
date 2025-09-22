import express from 'express'
import { changeWorkspaceMemberRoleController, createWorkspaceController, deleteWorkspaceByIdController, getAllWorkspacesUserIsMemberController, getWorkpsaceByIdController, getWorkspaceAnalyticsController, getWorkspaceMembersController, updateWorkspaceByIdController } from '../controllers/workspace.controller'

const router = express.Router()

router.post('/create/new',createWorkspaceController)
router.put('/update/:id',updateWorkspaceByIdController)

router.put('/change/member/role/:id',changeWorkspaceMemberRoleController)

router.delete('/delete/:id',deleteWorkspaceByIdController)
router.get('/all',getAllWorkspacesUserIsMemberController)

router.get('/members/:id',getWorkspaceMembersController)
router.get('/analytics/:id',getWorkspaceAnalyticsController)

router.get('/:id',getWorkpsaceByIdController)

export default router