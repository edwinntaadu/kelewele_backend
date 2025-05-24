const { Router } = require("express"); 
const authMiddleware = require("../middleware"); 

require("dotenv").config(); 
const {User, Verification, EmailPassReset, PhonePassReset, Session} = require("../../models/user_auth"); 
const Meals = require("../../models/mealData")
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const twilio = require('twilio');
const nodemailer = require('nodemailer');

 // Import the populateMeals model

const router = Router();

const authenticateToken = require("../middleware").authenticateToken; // Import the middleware

router.get("/meals_all", async (req, res) => {
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

router.get("/something", async (req, res) => {
    console.log("Search query2222:", req.query); // Log the search query
    try {

        const { query } = req.query;
        console.log("Search query:", query); // Log the search query
        const { keyword, category, sellerType, minPrice, maxPrice } = req.query;

        //const query = {};
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

// Search meals by keyword
router.get("/search", async (req, res) => {
    //Working Query: http://localhost:5000/meals/search?query=chicken
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }

        // Use regex to search for the keyword in multiple fields
        const meals = await Meals.find({
            $or: [
                { name: { $regex: query, $options: "i" } }, // Search in food name
                { "ingredients.name": { $regex: query, $options: "i" } }, // Search in ingredient names
                { description: { $regex: query, $options: "i" } }, // Search in description
                { tags: { $elemMatch: { $regex: query, $options: "i" } } } // Corrected: Search in tags (array of strings)
            ]
        });

        if (meals.length === 0) {
            //return res.status(404).json({ message: "No meals found matching the keyword" });
        }

        res.status(200).json(meals);
    } catch (error) {
        console.error("Error searching meals:", error);
        res.status(500).json({ message: "Failed to search meals" });
    }
});

//Router to populate meals with meal data
router.get("/populate-meals", async (req, res) => {
    console.log("Meals population router reached")
    try {
        //const meals = await Meals.find().populate("mealData");
        populateMeals()
            .then((meals) => {
                res.status(200).json(meals);
            })
            .catch((error) => {
                console.error("Error populating meals:", error);
                res.status(500).json({ message: "Failed to populate meals" });
            });
        res.status(200).json(meals);
    } catch (error) {
        console.error("Error populating meals:", error);
        res.status(500).json({ message: "Failed to populate meals" });
    }
});

//Router to populate meals with meal data
router.get("/getRankingMeals", async (req, res) => {
    
    try {
        const meals = await Meals.find().sort({ general_rating: -1 }).limit(10); // Get top 10 meals by general rating
        res.status(200).json(meals);    
        
    } catch (error) {
        console.error("Error getting ranking meals:", error);
        res.status(500).json({ message: "failed to get ranking meals" });
    }
});

module.exports = router;