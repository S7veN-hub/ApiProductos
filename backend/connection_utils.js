import { pool } from '../connection/connection.js'
import bcrypt from 'bcrypt'
import config from '../config.js'
import { text } from 'express'

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

async function getProductHistoryByUserId(userId, offset) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT Transaction_Id, Transaction_Date, Amount, Currency, User_Id, Product_Id FROM Transaction WHERE User_Id = $1 ORDER BY Transaction_Date DESC LIMIT $2 OFFSET $3',
        values: [userId, config.rows_per_page, offset]
    }
    const transactions = await client.query(query)
    const productIds = transactions.rows.map(transaction => transaction.product_id)
    const productQuery = {
        text: config.select_fields_products + ' FROM product INNER JOIN product_detail ON product.product_detail_id = product_detail.product_detail_id WHERE product.product_id = ANY($1) LIMIT $2 OFFSET $3',
        values: [productIds, config.rows_per_page, offset]
    }
    const products = await client.query(productQuery)
    client.release()
    return products.rows
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
    const passwordHashed = await bcrypt.hash(newUser.password, config.saltRounds)

    const query = {
        text: 'INSERT INTO User_Service (Name, Email, Password_Hash, Role) VALUES ($1, $2, $3, $4)',
        values: [newUser.name, newUser.email, passwordHashed, newUser.role]
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

async function getLoginUser(name, password) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT Password_Hash FROM User_Service WHERE Name = $1',
        values: [name]
    }
    const result = await client.query(query)
    const user = result.rows[0]
    const isOk = await bcrypt.compare(password, user.password_hash)
    if (!isOk) return []
    const query2 = {
        text: 'SELECT User_id, Name, Email, Role FROM User_Service WHERE Name = $1 AND Password_Hash = $2',
        values: [name, user.password_hash]
    }
    const result2 = await client.query(query2)
    client.release()
    return result2.rows
}

async function getUserByName(name) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT User_id, Name, Email, Role FROM User_Service WHERE Name = $1',
        values: [name]
    }
    const result = await client.query(query)
    client.release()
    return result.rows
}

async function createTokens(user) {
    const accessToken = await jwt.sign({ name: user.name, email: user.email, role: user.role }, config.secret_key_jwt, { expiresIn: '1m' })
    const sessionUUID = crypto.randomUUID()
    const refreshToken = await jwt.sign({ name: user.name, email: user.email, role: user.role, sessionId: sessionUUID }, config.secret_key_jwt, { expiresIn: '5m' })
    return { accessToken, refreshToken, sessionUUID, userObj: user }
}

async function addSession(user, refreshToken, sessionUUID) {
    const client = await pool.connect()
    let result = null
    let isSuccess = true
    const refreshToken_hashed = await bcrypt.hash(refreshToken, config.saltRounds)
    const expirationDate = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    const query = {
        text: 'INSERT INTO User_Session (User_id, Refresh_Token_Hash, Session_Id, Expiration_Date) VALUES ($1, $2, $3, $4)',
        values: [user.user_id, refreshToken_hashed, sessionUUID, expirationDate]
    }
    try {
        result = await client.query(query)
    } catch (err) {
        isSuccess = false
        console.log('Error adding session' + err)
    }
    client.release()
    return isSuccess
}

async function checkUserAccess(accessToken) {
    let userName = null
    let user = null
    jwt.verify(accessToken, config.secret_key_jwt, async (err, decoded) => {
        if (err) {
            return null // This will exit the callback, but not the outer function
        }
        userName = decoded.name
    })
    user = await getUserByName(userName)
    return user
}

async function refreshToken(refreshToken) {
    let sessionId = null
    jwt.verify(refreshToken, config.secret_key_jwt, (err, decoded) => {
        if (err) {
            return null
        }
        sessionId = decoded.sessionId
    })
    if (!sessionId) return null
    const client = await pool.connect()
    const query = {
        text: 'SELECT Session_Id, Revoked_at, User_id, Refresh_Token_Hash, Expiration_Date, Created_at  FROM User_Session WHERE Session_Id = $1 ORDER BY Created_at DESC LIMIT 1',
        values: [sessionId]
    }
    const result = await client.query(query)
    const session = result.rows[0]
    if (!validateSession(session)) return null
    const userQuery = {
        text: 'SELECT User_id, Name, Email, Role FROM User_Service WHERE User_id = $1',
        values: [session.user_id]
    }
    const userResult = await client.query(userQuery)
    const user = userResult.rows[0]
    client.release()
    let newTokens = await createTokens(user)
    return newTokens
}

function validateSession(session) {
    let isOk = true
    let now = new Date()
    if (session.revoked_at || session.expiration_date < now) {
        isOk = false
    }
    return isOk
}

async function checkIfExistNewUser(email, name) {
    const client = await pool.connect()
    const query = {
        text: 'SELECT Email FROM User_Service WHERE Email = $1 OR Name = $2',
        values: [email, name]
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

const connection_utils = { getProductsByType, getProductsByPriceRange, getProductsByProductId, getProductsByProductName, getLoginUser, createTokens, addSession, refreshToken, isProductinStock, getProducts, getProductHistoryByUserId, checkIfExistNewUser, addProducts, addNewUser, decreaseStock, addStock, checkUserAccess }

export default connection_utils