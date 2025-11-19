import express from 'express'

const router = express.Router()

router.get('/register', (req, res) => {
    res.json({ 'msg': 'Hello' })
})

export default router