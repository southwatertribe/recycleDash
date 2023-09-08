const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const pool = require('./db/dbconnection');
var bodyParser = require('body-parser')

//Routers
const register = require('./routes/accounts')
const admin = require('./routes/admin');
const auth = require('./routes/auth');
const tickets = require('./routes/tickets');
const locationService = require('./routes/location');
const refresh = require('./routes/refresh');
const credentials = require('./middleware/credentials');
const pdfService = require('./routes/pdf')
const { verifyJWT } = require('./middleware/verifyJWT');
const reports = require('./routes/reports')



const startServer = async () => {

    const server = express()
    
    //Use middleware
    server.use(
        cors({
          origin: '*', 
          
        //   'https://elaborate-piroshki-e49c3e.netlify.app/'
          // preflightContinue: true,
          // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
          credentials: true,
          allowedHeaders:  ['Content-Type', 'Authorization'],
          exposedHeaders: ["Set-Cookie"]
        })
    );
    server.use(express.json())
    server.use(cookieParser()) 
    

    //Routes
    server.use('/register', register)
    server.use('/login', auth)
    server.use('/refresh', refresh)
    // server.use(verifyJWT)
    server.use('/admin', admin)
    server.use('/location-service', locationService)
    server.use('/ticket-service', tickets)
    server.use('/pdf-service', pdfService)
    server.use('/report-service', reports)

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
