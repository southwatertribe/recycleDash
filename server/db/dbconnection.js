require('dotenv').config();
const mysql = require('mysql2')


    const pool = mysql.createConnection({
        host: process.env.STAGEDBHOST,
        user: process.env.STAGEDBUSER,
        password: process.env.STAGEDBPASS,
        database: process.env.STAGEDBNAME,
        multipleStatements: true
        
    }).promise();
    


module.exports = pool