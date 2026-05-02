import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World! How are you doing?')
})

app.get('/contactos/:id/', (req, res, next) => {
    // res.send(req.params)
    if (req.params.id === '0') return next()
    res.send('Soy la página de contactos')
})

app.get('/contactos/:id/', (req, res) => {
    res.send('Soy la página de contactos con id 0')
})

app.get('/', (req, res) => {
    res.send('Hello World! How are you doing? SECOND')
})

app.post('/', (req, res) => {
    res.send('I\'m a POST response ;=)')
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})