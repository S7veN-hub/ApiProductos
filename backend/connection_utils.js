import { pool } from '../connection/connection.js'

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

testingConnection()

async function getProductsByType(type) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT product.name as name, product.image as image, product_detail.price as price, product_detail.discount as discount, product_detail.stock as stock, product_detail.currency as currency, product_detail.description as description FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product_type = $1',
        values: [type]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function getProductsByPriceRange(minPrice, maxPrice) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT product.name as name, product.image as image, product_detail.price as price, product_detail.discount as discount, product_detail.stock as stock, product_detail.currency as currency, product_detail.description as description FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product_detail.price >= $1 AND product_detail.price <= $2',
        values: [minPrice, maxPrice]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function getProductsByProductId(productId) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT product.name as name, product.image as image, product_detail.price as price, product_detail.discount as discount, product_detail.stock as stock, product_detail.currency as currency, product_detail.description as description FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product.product_id = $1',
        values: [productId]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function getProductsByProductName(productName) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT product.name as name, product.image as image, product_detail.price as price, product_detail.discount as discount, product_detail.stock as stock, product_detail.currency as currency, product_detail.description as description FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product.name ILIKE $1',
        values: ['%' + productName + '%']
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

export { getProductsByType, getProductsByPriceRange, getProductsByProductId, getProductsByProductName, isProductinStock }