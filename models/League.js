const mongoose = require ('mongoose');
const slugify = require ('slugify');

const LeagueSchema = new mongoose.Schema({
    league: {
        type: String,
        required: [true, 'Please add a name'],
        unique: [true, 'League name must be unique'],
        trim: true,
        maxlength: [50, 'Name can not be longer than 50 characters']
    },
    description: {
        type: String,
        required: true,
        maxlength: [300, 'Description can not be longer than 300 characters']
    },
    headquarters: {
        type: String,
        required: true,
        maxlength: 50
    },
    commissioner: {
        type: String,
        required: true
    },
    rules : {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
},);

module.exports = mongoose.model('League', LeagueSchema);

