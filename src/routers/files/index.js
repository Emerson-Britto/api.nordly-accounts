const router = require('express').Router()

const imgDb = require('./imgDb.js')


router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.set('Content-Type', 'image/gif')
    res.status(200)
    res.end()
})

router.get('/img', async (req, res) => {
    const path = req.query.path

    const result = await imgDb(path)

    res.sendFile(result)
})

module.exports = router