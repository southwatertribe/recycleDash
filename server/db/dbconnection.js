require('dotenv').config();
const mysql = require('mysql2')



    const pool = mysql.createConnection({
        host: process.env.STAGEDBHOST,
        user: process.env.STAGEDBUSER,
        password: process.env.STAGEDBPASS,
        database: process.env.STAGEDBNAME,
        multipleStatements: true
        
    }).promise();
    


    // connection.connect(function (err) {
    //     if (err) {
    //       console.error("Database connection  failed: " + err.stack);
    //       return;
    //     }
    //     console.log("Connected to database.");
    //   });


module.exports = pool