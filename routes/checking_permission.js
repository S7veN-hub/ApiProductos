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
        return res.status(401).json({ isSuccess: false, message: 'Access token is missing' })
    }

    connection_utils.checkUserAccess(accessToken)
    .then(async user => {
        if (user && user.length > 0) {
            res.json({ isSuccess: true, data: user})
        } else {
            const response = await fetch(config.apiURL + '/refresh/refresh_token', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: req.cookies?.refreshToken
                })
            })
            const data = await response.json();
            if (data.isSuccess) {
                res.cookie('accessToken', data.data.accessToken, { httpOnly: true, sameSite: 'lax', path: '/' })
                res.cookie('refreshToken', data.data.refreshToken, { httpOnly: true, sameSite: 'lax', path: '/' })
                res.json({ isSuccess: true, data: [data.data.userObj] })
            } else {
                res.status(401).json({ isSuccess: false, message: 'User session has expired' })
            }
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