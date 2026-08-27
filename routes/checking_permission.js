import express from 'express'
import connection_utils from '../backend/connection_utils.js'
import general_utils from '../backend/general_utils.js'
import config from '../config.js'

const router = express.Router()

router.use((req, res, next) => {
    res.header(
        'Access-Control-Allow-Origin',
        config.access_control_allow_origin
    );

    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );

    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type'
    );

    next();
})

router.get('/check_user', async (req, res, next) => {
    console.log('Check User Permission Page')
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        next(new Error('Access token is missing'))
    }

    connection_utils.checkUserAccess(accessToken)
    .then(user => {
        if (user) {
            res.json([user])
        } else {
            window.location.href = document.location.origin + '/refresh/refresh_token'
        }
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