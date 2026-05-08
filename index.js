import express from 'express'

const app = express()
const port = 3000

app.disable('x-powered-by')

app.get('/', (req, res, next) => {
    console.log('Request Ip: ' + req.ip)
    res.send('Hello World!')
})

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