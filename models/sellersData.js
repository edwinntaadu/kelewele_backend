const { Schema, model } = require("../conn/connection");

const SellerSchema = new Schema({
    name: { type: String, required: true }, // Seller's name
    email: { type: String, required: true, unique: true }, // Seller's email
    phone: { type: String, required: true }, // Seller's phone number
    sellerType: { 
        type: String, 
        enum: ["Private", "Business"], // Allowed values
        required: true // Indicates if the seller is private or a business
    },
    general_rating: { 
        type: Number, 
        default: 0, // Default rating
        min: 0, 
        max: 5 // Rating range from 0 to 5
    },
    health_rating: { type: Number, required: false }, // health rating
    trend_rating: { type: Number, required: false }, // trend rating
    profileId: { 
        type: Schema.Types.ObjectId, 
        ref: "UserProfile", // Reference to the actual profile information
        required: true 
    },
    address: {
        street: { type: String, required: false },
        city: { type: String, required: false },
        state: { type: String, required: false },
        zip: { type: String, required: false }
    },
    createdAt: { type: Date, default: Date.now }, // Timestamp for when the seller was created
    updatedAt: { type: Date, default: Date.now } // Timestamp for when the seller was last updated
},
{ collection: 'sellers_information' });


const Sellers = model("sellers_information", SellerSchema);
module.exports = Sellers;