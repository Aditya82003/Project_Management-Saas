import express from 'express'
import { createWorkspaceController } from '../controllers/workspace.controller'

const router = express.Router()

router.post('/create/new',createWorkspaceController)

export default router