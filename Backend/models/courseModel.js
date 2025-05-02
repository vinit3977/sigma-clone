const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    duration: {
        type: String,
        required: [true, 'Please add course duration']
    },
    // price: {
    //     type: Number,
    //     required: [true, 'Please add course price']
    // },
    category: {
        type: String,
        required: [true, 'Please add course category']
    },
    image: {
        type: String,
        default: ''
    },
    // videoUrl: {
    //     type: String,
    //     default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    // }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema); 