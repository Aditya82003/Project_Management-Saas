import express from "express"
import { get } from "http"
import { getCurrentUserController } from "../controllers/user.controller"

const router = express.Router()

router.get('/current',getCurrentUserController)

export default router