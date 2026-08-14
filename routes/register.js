import express from 'express'
import connection_utils from '../backend/connection_utils.js'
import general_utils from '../backend/general_utils.js'
import config from '../config.js'

const router = express.Router()

router.post('/check_user', async (req, res, next) => {
    console.log('Register Check User Page')
    const { email, name } = req.body

    connection_utils.checkIfExistNewUser(email, name)
    .then(data => {
        res.json({ exists: data })
    })
    .catch(err => {
        next(err)
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