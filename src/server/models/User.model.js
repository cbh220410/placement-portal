const mongoose = require('mongoose');

// Defines the data structure for every user in the database
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    // The role is crucial for protecting routes and controlling access
    role: {
        type: String,
        enum: ['student', 'employer', 'admin'],
        default: 'student',
    },
    // Adding conceptual fields required by the frontend
    skills: {
        type: [String], // Array of strings for skills
        default: [],
    },
    profile_status: {
        type: String,
        default: 'incomplete',
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;