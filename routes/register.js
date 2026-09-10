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
});

router.post('/check_user', async (req, res, next) => {
    console.log('Register Check User Page')
    const { email, name } = req.body

    connection_utils.checkIfExistNewUser(email, name)
    .then(data => {
        res.json({ exists: data })
    })
    .catch(err => {
        return next(err)
    })
})

router.post('/register_user', async (req, res, next) => {
    console.log('Register User Page')
    const newUser = req.body

    connection_utils.addNewUser(newUser)
    .then(isSuccess => {
        if (isSuccess) {
            res.status(201).json({ isSuccess: true, message: 'User registered successfully' })
        } else {
            res.status(400).json({ isSuccess: false, message: 'Failed to register user' })
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