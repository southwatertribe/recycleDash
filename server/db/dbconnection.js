require('dotenv').config();
const mysql = require('mysql2')



    const pool = mysql.createPool({
        host: process.env.DEVDBHOST,
        user: process.env.DEVDBUSER,
        password: process.env.DEVDBPASS,
        database: process.env.DEVDBNAME
    }).promise()
    



module.exports = pool