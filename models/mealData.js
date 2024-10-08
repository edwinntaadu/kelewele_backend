const mongoose = require('mongoose');

const mealsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        required: true,
        unique: true,
    },
    ingredients: {
        type: [String],
        required: true,
    },
    date_added: {
        type: Date,
        default: new Date(),
    },
});

var mealsData = mongoose.model('mealsData', mealsSchema);
module.exports = mealsData;