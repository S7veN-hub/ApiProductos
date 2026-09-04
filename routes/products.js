import express from 'express'
import connection_utils from '../backend/connection_utils.js'
import general_utils from '../backend/general_utils.js'
import config from '../config.js'

const router = express.Router()

router.get('/', (req, res, next) => {
    console.log('Products Page')
    let offset = general_utils.calculateOffset(req.query.numberPage)
    res.header('Access-Control-Allow-Origin', config.access_control_allow_origin)

    connection_utils.getProducts(offset)
    .then((data) => {
        res.json(data)
    }).catch((err) => {
        next(err)
    })
})

router.get('/search_product', (req, res, next) => {
    console.log('Products by searching product name Page')
    res.header('Access-Control-Allow-Origin', config.access_control_allow_origin)
    let offset = general_utils.calculateOffset(req.query.numberPage)
    let productName = ''
    if (req.query.product_name) {
        productName = req.query.product_name
    }

    connection_utils.getProductsByProductName(productName, offset)
    .then((data) => {
        res.json(data)
    }).catch((err) => {
        next(err)
    })
})

router.get('/:product_type', (req, res, next) => {
    console.log('Products by type Page')
    res.header('Access-Control-Allow-Origin', config.access_control_allow_origin)
    let offset = general_utils.calculateOffset(req.query.numberPage)
    let productType = config.product_types[0]
    if (req.params.product_type && config.product_types.includes(req.params.product_type)) {
        productType = req.params.product_type
    }

    connection_utils.getProductsByType(productType, offset)
    .then((data) => {
        res.json(data)
    }).catch((err) => {
        next(err)
    })
})

router.get('/:product_type/:product_id', (req, res, next) => {
    console.log('Products by type and id Page')
    res.header('Access-Control-Allow-Origin', config.access_control_allow_origin)
    let productType = config.product_types[0]
    let product_id = '';
    if (req.params.product_type && config.product_types.includes(req.params.product_type)) {
        productType = req.params.product_type
    }
    if (req.params.product_id) {
        product_id = req.params.product_id
    }

    connection_utils.getProductsByProductId(productType, product_id)
    .then((data) => {
        res.json(data)
    }).catch((err) => {
        next(err)
    })
})

router.get('/get_product_history/:user_id', (req, res, next) => {
    console.log('Products history by user id Page')
    res.header('Access-Control-Allow-Origin', config.access_control_allow_origin)
    const userId = req.params.user_id
    const offset = general_utils.calculateOffset(req.query.numberPage)

    connection_utils.getProductHistoryByUserId(userId, offset)
    .then((data) => {
        res.json(data)
    }).catch((err) => {
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