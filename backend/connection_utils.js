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
        text: config.select_fields_products + ' FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id LIMIT $1 OFFSET $2',
        values: [config.rows_per_page, offset]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function getProductsByType(type, offset) {
    const client = await pool.connect()
    const query = {
        text: config.select_fields_products + ' FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product.product_type = $1 LIMIT $2 OFFSET $3',
        values: [type, config.rows_per_page, offset]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function getProductsByPriceRange(minPrice, maxPrice, offset) {
    const client = await pool.connect()
    const query = {
        text: config.select_fields_products + ' FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product_detail.price >= $1 AND product_detail.price <= $2 LIMIT $3 OFFSET $4',
        values: [minPrice, maxPrice, config.rows_per_page, offset]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function getProductsByProductId(type, productId) {
    const client = await pool.connect()
    const query = {
        text: config.select_fields_products + ' FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product.product_type = $1 AND product.product_id = $2',
        values: [type, productId]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function getProductsByProductName(productName, offset) {
    const client = await pool.connect()
    const query = {
        text: config.select_fields_products + ' FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product.name LIKE $1 LIMIT $2 OFFSET $3',
        values: ['%' + productName + '%', config.rows_per_page, offset]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function addProducts(productList) {
    const client = await pool.connect()
    await client.query('BEGIN')
    let isSuccess = true;
    try {
        if (Array.isArray(productList)) {
            for (const product of productList) {
                if (filterProductFields(product)) {
                    const query = {
                        text: 'INSERT INTO Product_Detail (Description, Price, Discount, Stock, Currency) VALUES ($1, $2, $3, $4, $5) RETURNING product_detail_id',
                        values: [product.description, product.price, product.discount, product.stock, product.currency]
                    }
                    const result = await client.query(query)
                    const productDetailId = result.rows[0].product_detail_id
                    const productQuery = {
                        text: 'INSERT INTO Product (Name, Image, Product_Type, Product_Detail_ID) VALUES ($1, $2, $3, $4)',
                        values: [product.name, product.image, product.type, productDetailId]
                    }
                    await client.query(productQuery)
                } else {
                    isSuccess = false
                    break
                }
            }
        }
    } catch (err) {
        isSuccess = false
        await client.query('ROLLBACK')
        console.log('Error adding products' + err)
    }
    await client.query('COMMIT')
    client.release()
    return isSuccess
}

async function addNewUser(newUser) {
    const client = await pool.connect()
    let result = null
    let isSuccess = true
    const query = {
        text: 'INSERT INTO Users (Name, Email, Password, Role) VALUES ($1, $2, $3, $4)',
        values: [newUser.name, newUser.email, newUser.password, newUser.role]
    }
    try {
        result = await client.query(query)
    } catch (err) {
        isSuccess = false
        console.log('Error adding new user' + err)
    }
    client.release()
    return isSuccess
}

async function getLoginUser(email, password) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT Name, Email, Role FROM Users WHERE Email = $1 AND Password = $2',
        values: [email, password]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function checkIfExistNewUser(email) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT Email FROM Users WHERE Email = $1',
        values: [email]
    }
    const result = await client.query(query)
    client.release()
    return result.rows.length > 0 ? true : false
}

function filterProductFields(product) {
    let isSuccess = true
    if (!product.name || !product.image || !product.type || !product.price || !product.currency) {
        isSuccess = false
    }
    return isSuccess
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
        text: config.select_fields_products + ' FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product.product_id = ANY($1) AND product_detail.stock > 0',
        values: [productIdList]
    }
    const result = await client.query(query)
    client.release()
    return result.rows.length > 0 ? true : false
}

const connection_utils = { getProductsByType, getProductsByPriceRange, getProductsByProductId, getProductsByProductName, getLoginUser, isProductinStock, getProducts, checkIfExistNewUser, addProducts, addNewUser, decreaseStock, addStock }

export default connection_utils