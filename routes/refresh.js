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

router.post('/refresh_token', async (req, res, next) => {
    console.log('Refresh Token Page')
    let user = null
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).json({ isSuccess: false, message: 'Refresh token is missing' })
    }

    connection_utils.refreshToken(refreshToken)
    .then(newTokens => {
        if (newTokens) {
            connection_utils.addSession(newTokens.userObj, newTokens.refreshToken, newTokens.sessionUUID)
            .then(isSuccess => {
                if (!isSuccess) {
                    return next(new Error('Failed to refresh a new session for user'))
                }
                res.cookie('accessToken', newTokens.accessToken, { httpOnly: true })
                res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true })
                user = newTokens.userObj
                res.json({ isSuccess: true, data: user })
            })
            .catch(err => {
                return next(err)
            })
        } else {
            return next(new Error('Invalid or expired refresh token'))
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