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
        'Access-Control-Allow-Credentials',
        'true'
    )

    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );

    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type'
    );

    return next();
})

router.get('/check_user', async (req, res, next) => {
    console.log('Check User Permission Page')
    const accessToken = req.cookies?.accessToken

    if (!accessToken) {
        return res.status(100).json({ isSuccess: false, message: 'Access token is missing' })
    }

    connection_utils.checkUserAccess(accessToken)
    .then(user => {
        if (user) {
            res.json({ isSuccess: true, data: user})
        } else {
            res.redirect('/refresh/refresh_token')
        }
    })
    .catch(err => {
        return next(err)
    })
})

router.use((err, req, res, next) => {
    console.log('Error: ' + err)
    res.status(500).json({ isSuccess: false, message: err.message || 'Internal Server Error' })
})

export default router