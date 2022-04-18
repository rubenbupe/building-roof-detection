const mongoose = require('mongoose');


const predictionSchema = new mongoose.Schema({ //todo add credit card number
    execution_time: {
        type: Number,
        required: true,
    },
    message_datetime: {
        type: Date,
        required: true,
    },
    api_type: {
        type: String,
        required: true,
    },
    segmentation_type: {
        type: String,
        required: true,
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'prediction' });

const Prediction = mongoose.model('Prediction', predictionSchema, 'prediction');

module.exports.Prediction = Prediction;

