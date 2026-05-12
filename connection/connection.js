import { Pool } from 'pg'
import config from '../config.js'

const pool = new Pool({
    user: config.user_db,
    host: config.host_db,
    database: config.database_db,
    password: config.password_db,
    port: config.port_db
})

export { pool }