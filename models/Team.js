
//This will be a reference sheet for various fields

const mongoose = require('mongoose');
const slugify = require('slugify');

const TeamSchema = new mongoose.Schema({
    team_name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, ' Name can not be longer than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add your team description'],
        maxlength: [500, 'Description can not be longer than 500 characters']
    },
    website : {
        type: String,
        match: [ /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with http or HTTPS']
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 character']
    },
    email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please add a valid email']
    },
    address: {
        type: String,
        required: [false, 'Please add an address']
    },
    location: {
        //GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
        //Array of strings, type should be String but in brackets [String]
        type: [String],
        required: true,
        //Enum means that these are the only available values that it can have
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must at least be 1'],
        max: [10, 'Rating can not be more than 10']
    },
    averageCost: Number,
    photo: {
        // In the data base this will just be the name of the file
        type: String,
        default: 'no-photo.jpeg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGiBill: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    league: {
        type: mongoose.Schema.ObjectId,
        ref: 'League',
    }
}, {
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

//Create team slug from the name
TeamSchema.pre('save', function(next) {
    this.slug = slugify(this.team_name, {lower:true}); //Will create and put in the slug into the DB
    console.log('Slugify ran', this.team_name);
    next();
});

//Reverse populate with virtuals
TeamSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'team',
    justOne: false
});

TeamSchema.virtual('teams', {
    ref: 'League',
    localField: '_id',
    foreignField: 'teams',
    justOne: false
})

module.exports = mongoose.model('Team', TeamSchema);
