import { Client } from 'pg'
import config from '../config.js'

const client = new Client({
    user: config.user_db,
    host: config.host_db,
    database: config.database_db,
    password: config.password_db,
    port: config.port_db
})

export default client