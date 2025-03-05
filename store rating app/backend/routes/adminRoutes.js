const express = require("express");
const { Op } = require("sequelize");
const { User } = require("../models");
const { authenticateToken, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();

// 🔹 Get All Users with Sorting & Filtering (Admin Only)
router.get("/user", authenticateToken, isAdmin, async (req, res) => {
    try {
        const { sortBy = "name", order = "ASC", name, email, role } = req.query;

        const whereClause = {};
        if (name) whereClause.name = { [Op.like]: `%${name}%` };
        if (email) whereClause.email = { [Op.like]: `%${email}%` };
        if (role) whereClause.role = role;

        const users = await User.findAll({
            where: whereClause,
            order: [[sortBy, order.toUpperCase()]],
        });

        res.status(200).json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
