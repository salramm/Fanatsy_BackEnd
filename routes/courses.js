const express = require('express');
const {getCourses} = require('../controllers/courses');   //Importing the methods creating in controller on the TEAM object that we created

//Creating a Router
const router = express.Router({ mergeParams: true}); // Added mergeparams bc we are merging URL Params

const { protect } = require('../middleware/auth');

router.route('/').get(getCourses);

//Add the protect middleware to the Create course and Update and Delete the course

module.exports = router;


