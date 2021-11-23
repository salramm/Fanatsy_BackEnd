const Team = require('../models/Team');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');
//Now we have this 'Team' object that we can call our methods on


// This is a header before every method that describes what it does

// @desc        get all teams
// @route       GET /api/v1/teams
// @access      Public
exports.getTeams = asyncHandler(async (req, res, next) => {  //Wrapped this in async middleware to avoid writing like in comment section below
        const teams = await Team.findOne({user: req.user.id})  // .populate('courses');

        res.status(200).json(teams);
    
        // res.status(200).json({success: true, count: teams.length, data: teams});
        
});

/* exports.getTeams = async (req, res, next) => {

    try {
        const teams = await Team.find();
        res.status(200).json({success: true, count: teams.length, data: teams});
    } catch (error) {
        next(error);
        // OLD: res.status(400).json({success: false })
    }
    // Was previously here: res.status(200).json({success: true, msg: 'Show all teams', hello: req.hello});
}*/



// @desc        get a single teams
// @route       GET /api/v1/teams/:id
// @access      Public
exports.getTeam = asyncHandler( async (req, res, next) => {

        const team = await Team.findById(req.params.id); //req.params.id will get the id form the request
        
        if (!team) {
            return next(
                new ErrorResponse(`Team not found with id of  ${req.params.id}`, 404)); //Thsi will handle the rejection if the ID does not exist but is correctly formatted
        }
});


// @desc        Create a new team
// @route       POST /api/v1/teams
// @access      Private
exports.createTeam = asyncHandler( async (req, res, next) => {
    /* console.log(req.body);  To see what data is coming from the client in the request but in order to this we need 
    to add a middleware that is included with express - do this in server.js */
    // res.status(200).json({success: true, msg: 'Create a new team'});
    // Try catch will help handle promise rejections; the code will not hang and end with success: flase
        //Add user to req.body
        req.body.user = req.user.id

        //Check for published teams -- only create one team
        const publishedTeam = await Team.findOne({user: req.user.id}); // will find any team created by this user

        // If the user is not an admin, they can only add 1 team
        if(publishedTeam && req.user.role !== 'admin') {
            return next(new ErrorResponse(`The user with id ${req.user.id} has already published a team`,400 ));
        }


        const team = await Team.create(req.body); //We take the entered info in body and pass into the create method on our model
        
        console.log('hello')

        res.status(201).json({
            success: true, data: team
        })
});


// @desc        Update a teams
// @route       PUT /api/v1/teams/:id
// @access      Private
exports.updateTeam = asyncHandler( async (req, res, next) => {
        let team = await Team.findById(req.params.id); // We are find the entry by id and the pass what we want to inser with req.body

        if(!team) {
            return next(
                new ErrorResponse(`Team not found with id of  ${req.params.id}`, 404));
        }

        // Make sure the user is team owner
        if (team.user.toString() !== req.user.id && !req.user.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this team`, 401))
        }

        team = await Team.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({success: true, data: team})
});


// @desc        delete a team
// @route       DELETE /api/v1/teams/:id
// @access      Public
exports.deleteTeam = asyncHandler( async (req, res, next) => {
        let team = await Team.findById(req.params.id)

        if (!team) {
            return next(
                new ErrorResponse(`Team not found with id of  ${req.params.id}`, 404));
        }

        //Make sure the user is the team owner
        if (team.user.toString() !== req.user.id && !req.user.role !== 'admin' ) {
            return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this team`, 401))
        };

        team.remove();

        res.status(200).json({success: true, data: {}});
});

// @desc        upload photo for team
// @route       PUT /api/v1/teams/:id/photo
// @access      Private

exports.teamPhotoUpload = asyncHandler( async (req, res, next) => {
    const team = await Team.findById(req.params.id)

    if (!team) {
        return next(
            new ErrorResponse(`Team not found with id of  ${req.params.id}`, 404));
    }

    //Make sure the user is the team owner
    if (team.user.toString() !== req.body.id && req.body.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this team`, 401))
    };

    if (!req.files) {
        return next(
            new ErrorResponse(`Please upload a file`, 404));
    }

    const file = req.files.file;

    // Make sure that the image is the photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 404));
    }

    // Check file size - less than 1 mb
    if (!file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`, 404));
    }

    // Create custome file name - we could have also used date stamps for this
    file.name = `photo_${team._id}${path.parse(file.name).ext}`;

    // Now we need to move the file
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        await Team.findByIdAndUpdate(req.params.id, { photo: file.name })

        res.status(200).json({seccess: true, data: file.name})
    });
});