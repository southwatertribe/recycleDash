require('dotenv').config();
const mysql = require('mysql2')

    const pool = mysql.createConnection({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASS,
        database: process.env.DBNAME,
        port: process.env.DBPORT,
        multipleStatements: true,  
    }).promise();
    

module.exports = pool