import express from 'express'
import connection_utils from '../backend/connection_utils.js'
import general_utils from '../backend/general_utils.js'
import config from '../config.js'

const router = express.Router()

router.post('/login_user', async (req, res, next) => {
    console.log('Login User Page')
    const { name, password } = req.body

    connection_utils.getLoginUser(name, password)
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        next(err)
    })
})

router.use((err, req, res, next) => {
    console.log('Error: ' + err.message)
    if (err.status === 404) {
        res.status(404).send('Data not found')
    } else {
        res.status(500).send('Internal Server Error')
    }
})

export default router