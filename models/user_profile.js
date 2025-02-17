const {Schema, model} = require("../conn/connection") // import Schema & model

const UserProfileSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    userID: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other']},
    profilePicture: { type: String}, // URL to profile picture
    phoneCode: { type: String},
    phoneNumber: { type: String},
    addresses: [{
        type: { type: String, enum: ['Home', 'Work', 'Other']},
        street: { type: String},
        city: { type: String},
        state: { type: String},
        zipCode: { type: String},
        country: { type: String}
    }],
    preferences: {
        cuisines: [{ type: String }],
        dietaryRestrictions: [{ type: String }],
        preferredDeliveryTime: { type: String, enum: ['Morning', 'Afternoon', 'Evening'], required: false },
        favoriteRestaurants: [{ type: String }]
    },
    rewards: {
        loyaltyPoints: { type: Number, default: 0 },
        redeemedRewards: [{ type: String }]
    },
    notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
    },
    accountSettings: {
        language: { type: String, default: 'en' },
        timeZone: { type: String, required: false },
        privacySettings: { type: Map, of: Boolean }
    },
    security: {
        twoFactorAuth: { type: Boolean, default: false },
        loginHistory: [{
            timestamp: { type: Date, default: Date.now },
            ip: { type: String }
        }]
    }
});

// UserProfile model
const UserProfile = model("User_profile", UserProfileSchema)

module.exports = UserProfile