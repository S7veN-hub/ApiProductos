import express from 'express'
import config from './config.js'
import productsRouter from './routes/products.js'
import adminRouter from './routes/admin.js'
import loginRouter from './routes/login.js'
import checkingPermissionRouter from './routes/checking_permission.js'
import registerRouter from './routes/register.js'
import refreshRouter from './routes/refresh.js'

const app = express()
const port = config.server_port

app.disable('x-powered-by')

app.use(express.json())

app.use('/assets', express.static('./assets'))

app.get('/', (req, res, next) => {
    res.send('Home Page')
})

app.use('/products', productsRouter)

app.use('/register', registerRouter)

app.use('/login', loginRouter)

app.use('/checking_permission', checkingPermissionRouter)

app.use('/refresh', refreshRouter)

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