const { Router } = require("express"); 
const authMiddleware = require("../middleware"); 

require("dotenv").config(); 
const {User, Verification, EmailPassReset, PhonePassReset, Session} = require("../../models/user_auth"); 
const UserProfile = require("../../models/mealData")
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const twilio = require('twilio');
const nodemailer = require('nodemailer');

const router = Router();

const authenticateToken = require("../middleware").authenticateToken; // Import the middleware

router.get("/meals", async (req, res) => {
    try {
        const meals = await Meals.find();
        res.status(200).json(meals);
    } catch (error) {
        console.error("Error fetching meals:", error);
        res.status(500).json({ message: "Failed to fetch meals" });
    }
});

router.get("/meals/:id", async (req, res) => {
    try {
        const meal = await Meals.findById(req.params.id);
        if (!meal) return res.status(404).json({ message: "Meal not found" });
        res.status(200).json(meal);
    } catch (error) {
        console.error("Error fetching meal:", error);
        res.status(500).json({ message: "Failed to fetch meal" });
    }
});

router.post("/meals", authenticateToken, async (req, res) => {
    try {
        const { name, description, price, category, ingredients, sellerType, sellerName, sellerId } = req.body;

        const newMeal = new Meals({
            name,
            description,
            price,
            category,
            ingredients,
            sellerType,
            sellerName,
            sellerId,
        });

        const savedMeal = await newMeal.save();
        res.status(201).json(savedMeal);
    } catch (error) {
        console.error("Error adding meal:", error);
        res.status(500).json({ message: "Failed to add meal" });
    }
});

router.put("/meals/:id", authenticateToken, async (req, res) => {
    try {
        const updatedMeal = await Meals.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMeal) return res.status(404).json({ message: "Meal not found" });
        res.status(200).json(updatedMeal);
    } catch (error) {
        console.error("Error updating meal:", error);
        res.status(500).json({ message: "Failed to update meal" });
    }
});

router.delete("/meals/:id", authenticateToken, async (req, res) => {
    try {
        const deletedMeal = await Meals.findByIdAndDelete(req.params.id);
        if (!deletedMeal) return res.status(404).json({ message: "Meal not found" });
        res.status(200).json({ message: "Meal deleted successfully" });
    } catch (error) {
        console.error("Error deleting meal:", error);
        res.status(500).json({ message: "Failed to delete meal" });
    }
});

router.get("/meals/search", async (req, res) => {
    try {
        const { keyword, category, sellerType, minPrice, maxPrice } = req.query;

        const query = {};
        if (keyword) query.name = { $regex: keyword, $options: "i" };
        if (category) query.category = category;
        if (sellerType) query.sellerType = sellerType;
        if (minPrice) query.price = { $gte: minPrice };
        if (maxPrice) query.price = { ...query.price, $lte: maxPrice };

        const meals = await Meals.find(query);
        res.status(200).json(meals);
    } catch (error) {
        console.error("Error searching meals:", error);
        res.status(500).json({ message: "Failed to search meals" });
    }
});

router.get("/meals/seller/:sellerId", async (req, res) => {
    try {
        const meals = await Meals.find({ sellerId: req.params.sellerId });
        res.status(200).json(meals);
    } catch (error) {
        console.error("Error fetching meals by seller:", error);
        res.status(500).json({ message: "Failed to fetch meals by seller" });
    }
});

module.exports = router;