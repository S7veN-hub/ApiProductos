import { pool } from '../connection/connection.js'
import config from '../config.js'

pool.on('connect', () => {
    console.log('Connected to the database')
})

pool.on('error', (err) => {
    console.log('Unexpected error has occurred' + err)
})

async function testingConnection() {
    const client = await pool.connect()
    // const query = 'SELECT NOW()'
    const query = 'SELECT product.name as name, product.image as image, product_detail.price as price, product_detail.discount as discount, product_detail.stock as stock, product_detail.currency as currency, product_detail.description as description FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id'
    const result = await client.query(query)
    for (const row of result.rows) {
        console.log(JSON.stringify(row))
    }
    client.release()
}

// testingConnection()

async function getProducts(offset) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT product.name as name, product.image as image, product_detail.price as price, product_detail.discount as discount, product_detail.stock as stock, product_detail.currency as currency, product_detail.description as description FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id LIMIT $1 OFFSET $2',
        values: [config.rows_per_page, offset]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function getProductsByType(type, offset) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT product.name as name, product.image as image, product_detail.price as price, product_detail.discount as discount, product_detail.stock as stock, product_detail.currency as currency, product_detail.description as description FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product.product_type = $1 LIMIT $2 OFFSET $3',
        values: [type, config.rows_per_page, offset]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function getProductsByPriceRange(minPrice, maxPrice, offset) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT product.name as name, product.image as image, product_detail.price as price, product_detail.discount as discount, product_detail.stock as stock, product_detail.currency as currency, product_detail.description as description FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product_detail.price >= $1 AND product_detail.price <= $2 LIMIT $3 OFFSET $4',
        values: [minPrice, maxPrice, config.rows_per_page, offset]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function getProductsByProductId(type, productId) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT product.name as name, product.image as image, product_detail.price as price, product_detail.discount as discount, product_detail.stock as stock, product_detail.currency as currency, product_detail.description as description FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product.product_type = $1 AND product.product_id = $2',
        values: [type, productId]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function getProductsByProductName(productName, offset) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT product.name as name, product.image as image, product_detail.price as price, product_detail.discount as discount, product_detail.stock as stock, product_detail.currency as currency, product_detail.description as description FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product.name LIKE $1 LIMIT $2 OFFSET $3',
        values: ['%' + productName + '%', config.rows_per_page, offset]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function decreaseStock(productIdList, quantity) {
    const client = await pool.connect()
    client.release()
}

async function addStock(productIdList, quantity) {
    const client = await pool.connect()
    client.release()
}

async function isProductinStock(productIdList) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT product.product_id as product_id, product.name as name, product.image as image, product_detail.price as price, product_detail.discount as discount, product_detail.stock as stock, product_detail.currency as currency, product_detail.description as description FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product.product_id = ANY($1) AND product_detail.stock > 0',
        values: [productIdList]
    }
    const result = await client.query(query)
    client.release()
    return result.rows.length > 0 ? true : false
}

const connection_utils = { getProductsByType, getProductsByPriceRange, getProductsByProductId, getProductsByProductName, isProductinStock, getProducts }

export default connection_utils