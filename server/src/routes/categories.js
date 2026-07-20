/**
 * Author: Jarren Bess
 * Week 8 - Sprint 3
 * File: categories.js
 * Description: API routes for listing categories.
 */

"use strict";

const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

/**
 * Jarren Bess
 * Week 8 - Sprint 3
 *
 * GET /?userId=
 *
 * Retrieves all category records belonging to the given userId.
 * userId is required; missing or non-numeric values return 400.
 *
 * Example:
 * fetch('/api/categories?userId=1000')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get("/", async (req, res) => {
  try {
    const userId = Number(req.query.userId);

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
