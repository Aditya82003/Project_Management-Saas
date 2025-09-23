import express from 'express'
import { joinWorkspaceController } from '../controllers/member.controller'

const router = express.Router()

router.post('/workspace/:inviteCode/join',joinWorkspaceController)


export default router