const League = require('../models/League');
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');

// @desc        Create a new league
// @route       POST /api/v1/leagues
// @access      Private

exports.createLeague = asyncHandler( async (req, res, next) => {


    req.body.user = req.user.id

    console.log(req.body)
    console.log('this is where the problem is')

    const league = await League.create(req.body); //We take the entered info in body and pass into the create method on our model


    res.status(201).json({
        success: true, data: league
    });
});


// @desc        Get league of an existing user
// @route       GET /api/v1/leagues/:id
// @access      Private

exports.getLeague = asyncHandler( async( req, res, next) => {

    const league = await League.findOne({user: req.user.id})


    if (!league) {
        return next(
            new ErrorResponse(`League not found with id of  ${req.params.id}`, 404)); //Thsi will handle the rejection if the ID does not exist but is correctly formatted
    }

    res.status(201).json(league)
})