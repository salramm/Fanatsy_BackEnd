const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//We have imported the 'Course' object that we can now call our methods on

// @desc        get all courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/teams/:teamId/courses    - this will allow to get courses by Team / Bootcamps
// @access      Public

exports.getCourses = asyncHandler( async (req, res, next) => {
    let query;
    
    if (req.params.teamId) {
        query = Course.find({ team: req.params.teamId})
    } else {
        query =  Course.find().populate({
            path: 'team',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({success: true, count: courses.length, data: courses})
});
