const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Workout Name is required']
    },
    userId: {
        type: String,
        required: [true, 'userId is required']
    },
    duration: {
        type: String,
        required: [true, 'Course Price is required']
    },
    status: {
        type: String,
        default: "pending"
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('Workout', workoutSchema);