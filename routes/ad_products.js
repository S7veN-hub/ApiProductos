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
                    res.sendStatus(201)
                } else {
                    res.sendStatus(400)
                }
            }).catch(err => {
                return next(err)
            })
        } else {
            res.sendStatus(400)
        }
    } catch (err) {
        return next(err)
    }
})

router.use((err, req, res, next) => {
    console.log('Error: ' + err)
    res.sendStatus(500)
})

export default router