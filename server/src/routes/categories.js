/**
 * File: categories.js
 * Description: API routes for listing a user's expense categories.
 */

"use strict";

const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

/**
 * GET /user/:userId
 *
 * Retrieves all categories belonging to the given userId, used to
 * populate category-name dropdowns on the client.
 *
 * Example:
 * fetch('/api/categories/user/1000')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "userId must be numeric." });
    }

    const categories = await Category.find({ userId });
    return res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    return res.status(500).json({ message: "Error fetching categories." });
  }
});

module.exports = router;
