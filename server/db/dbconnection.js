require('dotenv').config();
const mysql = require('mysql2')



    const pool = mysql.createConnection({
        host: process.env.DEVDBHOST,
        user: process.env.DEVDBUSER,
        password: process.env.DEVDBPASS,
        database: process.env.DEVDBNAME,
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