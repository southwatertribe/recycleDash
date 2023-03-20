const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const pool = require('./db/dbconnection');

//Routers
const register = require('./routes/accounts')
const admin = require('./routes/admin');
const auth = require('./routes/auth');
const tickets = require('./routes/tickets');
const locationService = require('./routes/location');
const refresh = require('./routes/refresh');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/cors_options');
const { verifyJWT } = require('./middleware/verifyJWT');



const startServer = async () => {

    // //THIS IF FOR DEV ONLY
    // sequelize.sync({ force: true }).then(() => {

        
    
    // }).catch((err) => {
      
    // });
    const server = express()
    
    //Use middleware
    server.use(
        cors({
          origin: 'http://localhost:3000',
          // preflightContinue: true,
          // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
          credentials: true,
        //   allowedHeaders:  ['Content-Type', 'Authorization']
        })
    );
    server.use(express.json())
    server.use(cookieParser()) 

    //Routes
    server.use('/register', register)
    server.use('/login', auth)
    server.use('/refresh', refresh)
    //server.use(verifyJWT)
    server.use('/admin', admin)
    server.use('/location-service', locationService)
    server.use('/tickets', tickets)

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
