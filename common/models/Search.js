const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({ //todo add credit card number
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
    query: {
        type: String,
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'search' });

const Search = mongoose.model('Search', searchSchema, 'search');

module.exports.Search = Search;

