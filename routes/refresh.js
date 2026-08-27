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

router.post('/refresh_token', async (req, res, next) => {
    console.log('Refresh Token Page')
    let user = {}
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        next(new Error('Refresh token is missing'))
    }

    connection_utils.refreshToken(refreshToken)
    .then(newTokens => {
        if (newTokens) {
            connection_utils.addSession(newTokens.userObj, newTokens.refreshToken, newTokens.sessionUUID)
            .then(isSuccess => {
                if (!isSuccess) {
                    next(new Error('Failed to add session for user'))
                }
                res.cookie('accessToken', newTokens.accessToken, { httpOnly: true })
                res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true })
                user = newTokens.userObj
            })
            .catch(err => {
                next(err)
            })
        } else {
            next(new Error('Invalid or expired refresh token'))
        }
        res.json([user])
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