require('dotenv').config();
const mysql = require('mysql2')

    const pool = mysql.createConnection({
        host: process.env.DEVDBHOST,
        user: process.env.DEVDBUSER,
        password: process.env.DEVDBPASS,
        database: process.env.DEVDBNAME,
        port: 3306,
        multipleStatements: true,  
            
    }).promise();
    

module.exports = pool