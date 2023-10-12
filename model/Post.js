const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    reactions: {
        thumbsup: {
            type: [String],
            required: true
        },
        mindblown: {
            type: [String],
            required: true
        },
        heart: {
            type: [String],
            required: true
        },
        celebration: {
            type: [String],
            required: true
        },
        eyes: {
            type: [String],
            required: true
        }
    },
    date: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Post', postSchema);
