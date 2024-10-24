const pg = require('pg');
const dotenv = require('dotenv')

dotenv.config()
const { user, password, host, port, database } = process.env;

const { Pool } = pg;

const connection = new Pool({
    user,
    password,
    host,
    port,
    database,

})


module.exports = {
    query: (text, params, callback) => {
        return connection.query(text, params, callback)
    }
}

function closeDb(signal) {
    console.log(`Received ${signal}, closing database connection.. !`)
    try {

        connection.end();
        console.log("Database connection closed")
        process.exit(0)

    } catch (e) {
        console.log('error during shutdown', e.stack)
        process.exit(1)
    }
}

process.on('SIGINT', closeDb.bind(null, 'SIGINT'))
process.on('SIGTERM', closeDb.bind(null, 'SIGTERM'))