import Types from 'pg'

import dotenv from 'dotenv'

dotenv.config()

const pool = new Types.Pool({
    host: process.env.HOST_BANCO,
    port: process.env.PORT_BANCO,
    database: process.env.DATABASE,
    user: process.env.USER_BANCO,
    password: process.env.PASSWORD_BANCO,
    datestyle: process.env.DATESYLE,
})

async function abrePool (pool) {
    try {
        await pool.connect()
        console.log('abriu a pool')
    } catch (error) {
        console.log(error)
    }
}

export {
    pool,
    abrePool
}