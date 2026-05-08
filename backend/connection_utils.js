import client from '../connection/connection.js'

async function testingConnection() {
    await client.connect()
    // const query = 'SELECT NOW()'
    const query = 'select * from product_detail'
    const result = await client.query(query)
    for (const row of result.rows) {
        console.log(JSON.stringify(row))
    }
    await client.end()
}

testingConnection()