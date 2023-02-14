const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
require('dotenv').config();
const pool = require('./db/dbconnection')

//Routers
const admin = require('./routes/admin')
const auth = require('./routes/auth')

var crypto = require('crypto');


const startServer = async () => {

    // //THIS IF FOR DEV ONLY
    // sequelize.sync({ force: true }).then(() => {

        
    
    // }).catch((err) => {
      
    // });
    const server = express()
    
    //Use middleware
    server.use(cors())
    server.use(express.json())
    server.use(cookieParser()) 

    //Routes
    server.use('/admin', admin)
    server.use('/login', auth)

    //Start
    console.log(`NODE_ENV=${process.env.NODE_ENV}`);
    
    

    server.listen(process.env.PORT, () => {
        console.log(`Spun up on ${process.env.PORT}`);
        console.log(`running in ${process.env.NODE_ENV} mode`);
        console.log("Let's get recycling ♻️")
    });


    
    // User.create(
    //     {
    //         user_id: crypto.randomUUID(),
    //         username: 'codaq',
    //         password: 'thepas',
    //         email: 'names@gmail',
    //         name: 'Danny'
    //     }
    // )

    

    


}

startServer()
