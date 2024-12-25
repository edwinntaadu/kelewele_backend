const {Schema, model} = require("../conn/connection")

const mealsSchema = new Schema({
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

const Meals = model('mealsData', mealsSchema);
module.exports = Meals;