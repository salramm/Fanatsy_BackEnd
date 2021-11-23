const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const { token } = require('morgan');

//Protect troutes 
exports.protect = asyncHandler( async (req, res, next) => {

    //  let token

   const token = req.header('x-auth-token'); // This was used for the UI

   console.log(token)
    
   // This was used when it was JUST API without the UI

    // if (req.headers.authorization && 
    //     req.headers.authorization.startsWith('Bearer')) 
    //     {
    //     token = req.headers.authorization.split(' ')[1];
    // }

    // else if (req.cookies.token) {
    //     token = req.cookies.token


    // }

    //Make sure that token exists 
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route 1', 401));
    }

    //Now verify the token
    try {
        //Extract the payload from the token
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // console.log(decode);

        req.user = await User.findById(decode.id);


        next();

    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route 2', 401));
    }

});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    }
}