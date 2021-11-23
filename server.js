const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');


//Load env vars
dotenv.config({ path: './config/config.env'});

//Connect to the DataBase - need to do this below the point where env variables are pulled in
connectDB();

//Route files pulled in
const leagues = require('./routes/leagues');
const teams = require('./routes/teams');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

//Initialize app variable with express
const app = express(); // Now I have the ability to create routes

//Body parser  -  this will allow us to parse the body of the request
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Dev logging middleware - run only if we are in the dev environment
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//File uploading middleware
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname, 'piblic')))   //__dirname will use the current directory we are in

//Mount Router
app.use('/api/v1/leagues', leagues);
app.use('/api/v1/teams', teams);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

//This will allow us to use custom error handler middleware
app.use(errorHandler);

// Server static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder 
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', ' build', 'index.html'))
    } )
}

//Set a PORT value
const PORT = process.env.PORT || 5000  //Process.env gives access to the environment variables

// Start listening to the server 
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold));

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //Close server and exit process   -   we want the app to fail if it doesn't connect to the app
    server.close(() => process.exit(1));
})
