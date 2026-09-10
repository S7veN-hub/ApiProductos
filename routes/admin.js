import express from 'express'
import connection_utils from '../backend/connection_utils.js'
import general_utils from '../backend/general_utils.js'
import config from '../config.js'
import productsRouter from './ad_products.js'

const router = express.Router()

router.get('/', (req, res, next) => {
    console.log('Admin Page')
})

router.use('/products', productsRouter)

router.use((err, req, res, next) => {
    console.log('Error: ' + err)
    res.sendStatus(500)
})

export default router