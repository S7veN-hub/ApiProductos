import express from 'express'
import config from './config.js'
import productsRouter from './routes/products.js'
import adminRouter from './routes/admin.js'

const app = express()
const port = config.server_port

app.disable('x-powered-by')

app.use(express.json())

app.use('/assets', express.static('./assets'))

app.get('/', (req, res, next) => {
    res.send('Home Page')
})

app.use('/products', productsRouter)

app.use('/admin', adminRouter)

app.use((err, req, res, next) => {
    console.log('Error: ' + err.message)
    if (err.status === 404) {
        res.status(404).send('Data not found')
    } else {
        res.status(500).send('Internal Server Error')
    }
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})