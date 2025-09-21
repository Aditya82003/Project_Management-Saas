import express from "express"

const router = express.Router()

router.get('/current', (req, res) => {
    res.json(req.user)
})

export default router