const express = require('express');
const SellersData = require('../../models/sellersData');
const authMiddleware = require("../middleware"); 

require("dotenv").config(); 

const router = express.Router();

// Get all sellers
router.get('/', async (req, res) => {
    try {
        const sellers = await SellersData.find();
        res.status(200).json(sellers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* // Get a single seller by ID
router.get('/:id', async (req, res) => {
    try {
        const seller = await SellersData.findById(req.params.id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.status(200).json(seller);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}); */

// Create a new seller
router.post('/', async (req, res) => {
    const seller = new SellersData(req.body);
    try {
        const newSeller = await seller.save();
        res.status(201).json(newSeller);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/* // Update a seller by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedSeller = await SellersData.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.status(200).json(updatedSeller);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}); */

// Search sellers by keyword
router.get('/search', async (req, res) => {
    const { query } = req.query; // Get the keyword from query parameters

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        // Use regex to search for the keyword in specific fields (e.g., name, description)
        const sellers = await SellersData.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // Case-insensitive search in the "name" field
                { description: { $regex: query, $options: 'i' } }, // Case-insensitive search in the "description" field
                { sellerType: { $regex: query, $options: 'i' } }, // Case-insensitive search in "sellerType"
                { "Address.street": { $regex: query, $options: 'i' } }, // Case-insensitive search in "Address.street"
                { "Address.city": { $regex: query, $options: 'i' } }, // Case-insensitive search in "Address.city"
                { "Address.state": { $regex: query, $options: 'i' } }, // Case-insensitive search in "Address.state"
                { "Address.zip": { $regex: query, $options: 'i' } } // Case-insensitive search in "Address.zip"
            ]
        });

        if (sellers.length === 0) {
            //return res.status(404).json({ message: 'No sellers found matching the keyword' });
        }

        res.status(200).json(sellers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a seller by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedSeller = await SellersData.findByIdAndDelete(req.params.id);
        if (!deletedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.status(200).json({ message: 'Seller deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;