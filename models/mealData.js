const {Schema, model} = require("../conn/connection")


const IngredientSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: String, required: true }, // e.g., "200g", "2 pieces"
    optional: { type: Boolean, default: false } // Indicates if the ingredient is optional
});

const MealSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // e.g., "Appetizer", "Main Course", "Dessert"
    availability: { type: Boolean, default: true }, // Indicates if the meal is currently available
    ingredients: [IngredientSchema], // Array of ingredients
    imageUrl: { type: String, required: false }, // URL to the meal's image
    preparationTime: { type: Number, required: true }, // Preparation time in minutes
    calories: { type: Number, required: false }, // Optional calorie count
    general_rating: { type: Number, required: false }, // marketplace rating
    health_rating: { type: Number, required: false }, // health rating
    trend_rating: { type: Number, required: false }, // trend rating
    tags: [{ type: String }], // e.g., ["Spicy", "Vegetarian"]
    sellerType: { 
        type: String, 
        enum: ["Private", "Business"], // Allowed values
        required: true // Make this field mandatory
    },
    sellerName: { type: String, required: true }, // Name of the seller
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true } // Reference to the seller's ID
},
{ collection: 'meals_data' });


const Meals = model('meals_Data', MealSchema);
module.exports = Meals;