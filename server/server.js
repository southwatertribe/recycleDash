const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const express = require('express');
require('dotenv').config();



const startServer = async () => {
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


}

startServer()