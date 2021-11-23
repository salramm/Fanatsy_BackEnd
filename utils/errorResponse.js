class ErrorResponse extends Error {
    constructor(message, statusCode) {      // constructor is a method that runs when we instantiate and object from the class
        super(message);                     // To call the constructor Error class that we are extending 
        this.statusCode = statusCode        // Creating a cutom property on this class called 'statusCode' and set it to whatever we pass in constructor
    } 
}

module.exports = ErrorResponse;