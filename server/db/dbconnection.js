require('dotenv').config();
const mysql = require('mysql2')
var fs = require("fs")


    const pool = mysql.createPool({
        host: process.env.STAGEDBHOST,
        user: process.env.STAGEDBUSER,
        password: process.env.STAGEDBPASS,
        database: process.env.STAGEDBNAME,
        multipleStatements: true,  
              
    }).promise();
    

module.exports = pool