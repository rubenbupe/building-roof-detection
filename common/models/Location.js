const mongoose = require('mongoose');


const locationSchema = new mongoose.Schema({
    message_datetime: {
        type: Date,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
	longitude: {
        type: Number,
        required: true,
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'location' });

const Location = mongoose.model('Location', locationSchema, 'location');

module.exports.Location = Location;

