const {Schema, model} = require("../conn/connection")

// User Schema
const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    username: {type: String},
    password: {type: String, required: true}
})

//
const VerificationSchema = new Schema({
    phone: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // Code expires after 5 minutes
});

const Email_verificationSchema_passReset = new Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // Code expires after 5 minutes
});
const Phone_verificationSchema_passReset = new Schema({
    phone: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // Code expires after 5 minutes
});


// User model
const User = model("User", UserSchema)
const EmailPassReset = model("email_verification_passReset", UserSchema)
const PhonePassReset = model("phone_verification_passReset", UserSchema)
const Verification = model("user_verification", VerificationSchema)

module.exports =  {User, Verification, EmailPassReset, PhonePassReset}