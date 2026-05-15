import express from 'express'
import connection_utils from '../backend/connection_utils.js'
import general_utils from '../backend/general_utils.js'
import config from '../config.js'

const router = express.Router()

router.post('/add_product', (req, res, next) => {
    console.log('Add Product Page')
    try {
        let productList = null
        if (req.body && Array.isArray(req.body)) {
            productList = req.body
        }
        if (productList && productList.length > 0) {
            connection_utils.addProducts(productList)
            .then(isSuccess => {
                if (isSuccess) {
                    res.status(201).send('Products added successfully')
                } else {
                    res.status(400).send('Failed to add products')
                }
            }).catch(err => {
                next(err)
            })
        } else {
            res.status(400).send('Invalid product list')
        }
    } catch (err) {
        next(err)
    }
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