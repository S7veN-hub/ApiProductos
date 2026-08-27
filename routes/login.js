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
});

router.post('/login_user', async (req, res, next) => {
    console.log('Login User Page')
    const { name, password } = req.body

    connection_utils.getLoginUser(name, password)
    .then(data => {
        if (data.length > 0) {
            connection_utils.createTokens(data[0])
            .then(tokens => {
                if (tokens.refreshToken) {
                    connection_utils.addSession(data[0], tokens.refreshToken, tokens.sessionUUID)
                    .then(isSuccess => {
                        if (!isSuccess) {
                            next(new Error('Failed to add session for user'))
                        }
                        res.cookie('accessToken', tokens.accessToken, { httpOnly: true })
                        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true })
                    })
                    .catch(err => {
                        next(err)
                    })
                } else {
                    next(new Error('Failed to create tokens for user'))
                }
            })
            .catch(err => {
                next(err)
            })
        }
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