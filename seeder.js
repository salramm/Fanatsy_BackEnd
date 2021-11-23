const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//Load the environment variables
dotenv.config({ path: './config/config.env'});

//Load Models
const Team = require('./models/Team');
const Course = require('./models/Course');
const User = require('./models/User');


//Connect to DB
connectDB();

// Read JSON files
const team = JSON.parse(fs.readFileSync(`${__dirname}/_data/teams.json`, 'utf-8'));

const course = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));

const user = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));

// Import into DB
const importData = async () => {
    try {
        await Team.create(team);
        await Course.create(course);
        await User.create(user);

        console.log('Data Imported...'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

// Delete Data
const deleteData = async () => {
    try {
        await Team.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed...'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

if (process.argv[2] === '-i') {
    importData();
}   else if (process.argv[2] === '-d') {
    deleteData();
}