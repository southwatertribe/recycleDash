const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { sequelize } = require('./models');
const User = require('./models').User;


var crypto = require('crypto');


const startServer = async () => {

    //THIS IF FOR DEV ONLY
    sequelize.sync({ force: true }).then(() => {

        
    
    }).catch((err) => {
      
    });
    const server = express()
    
    //Use middleware
    server.use(cors())
    server.use(express.json())
    server.use(cookieParser()) 

    //Routes

    //Start
    console.log(`NODE_ENV=${process.env.NODE_ENV}`);

    server.listen(process.env.PORT, () => {
        console.log(`Spun up on ${process.env.PORT}`);
        console.log(`running in ${process.env.NODE_ENV} mode`);
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
