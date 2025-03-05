const express = require("express");
const { Op } = require("sequelize"); 
const { Store, Rating, User } = require("../models");
const { authenticateToken, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();




// 🔹 Get All Stores (Accessible to all users)
router.get("/", async (req, res) => {
    try {
        const { sortBy = "name", order = "ASC", name, address } = req.query;

        const whereClause = {};
        if (name) whereClause.name = { [Op.like]: `%${name}%` };
        if (address) whereClause.address = { [Op.like]: `%${address}%` };

        const stores = await Store.findAll({
            where: whereClause,
            include: [
                {
                    model: Rating,
                    attributes: ["rating"],
                },
            ],
            order: [[sortBy, order.toUpperCase()]], // Sorting
        });


        const formattedStores = stores.map(store => ({
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            overallRating:
                store.Ratings.length > 0
                    ? (store.Ratings.reduce((sum, r) => sum + r.rating, 0) / store.Ratings.length).toFixed(1)
                    : "No ratings yet",
        }));

        res.status(200).json(formattedStores);
    } catch (error) {
        console.error("Error fetching stores:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🔹 Get Store Details by ID
router.get("/:storeId", async (req, res) => {
    console.log("✅ GET /stores/:storeId route hit with ID:", req.params.storeId);
    try {
        const store = await Store.findByPk(req.params.storeId, {
            include: [
                {
                    model: Rating,
                    attributes: ["rating"],
                },
            ],
        });

        if (!store) {
            console.log("❌ Store not found for ID:", req.params.storeId)
            return res.status(404).json({ message: "Store not found" });
        }

        res.status(200).json(store);
    } catch (error) {
        console.error("Error fetching store:", error);
        console.log("✅ Store found:", store);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🔹 Add New Store (Only Admins)
router.post("/", authenticateToken, isAdmin, async (req, res) => {
    console.log("✅ POST /stores route hit");
    try {
        const { name, email, address } = req.body;
        const newStore = await Store.create({ name, email, address });
        res.status(201).json({ message: "Store added successfully", store: newStore });
    } catch (error) {
        console.error("Error adding store:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🔹 Get Ratings for a Store (Store Owners)
router.get("/:storeId/ratings", authenticateToken, async (req, res) => {
    try {
        const { storeId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const store = await Store.findByPk(req.params.storeId);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        if (req.user.role !== "admin" && User.id !== store.ownerId) {
            return res.status(403).json({ message: "Forbidden: Only store owners or admins can view ratings" });
        }

        const ratings = await Rating.findAll({
            where: { storeId: req.params.storeId },
            include: [{ model: User, attributes: ["name", "email"] }],
        });

        res.status(200).json(ratings);
    } catch (error) {
        console.error("Error fetching ratings:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🔹 Submit a Rating for a Store (Authenticated users only)
router.post("/rate/:storeId", authenticateToken, async (req, res) => {
    try {
        const { storeId } = req.params;
        const { rating } = req.body;

        // Validate rating value
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Check if store exists
        const store = await Store.findByPk(storeId);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        // Save rating in database
        const newRating = await Rating.create({
            userId: req.user.id,
            storeId,
            rating
        });

        res.status(201).json({ message: "Rating submitted successfully", newRating });
    } catch (error) {
        console.error("Error submitting rating:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
