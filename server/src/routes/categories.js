/**
 * Author: Jarren Bess
 * Week 8 - Sprint 3
 * File: categories.js
 * Description: API routes for managing categories.
 *
 * Changes (Amanda Ruff, 7/20/2026):
 * - Fixed formatting and syntax issues after merging.
 * - Added the Create Category API endpoint.
 * - Added validation for required fields.
 * - Added duplicate category validation.
 * - Added appropriate HTTP status codes and error handling.
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
 * fetch("/api/categories?userId=1000")
 *   .then((response) => response.json())
 *   .then((data) => console.log(data));
 */
router.get("/", async (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: "userId must be numeric.",
      });
    }

    const categories = await Category.find({ userId });

    return res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);

    return res.status(500).json({
      message: "Error fetching categories.",
    });
  }
});

/**
 * Amanda Ruff
 * Week 8 - Sprint 3
 *
 * POST /
 *
 * Creates a new category for a user.
 * Validates all required fields before saving the category.
 */
router.post("/", async (req, res) => {
  try {
    const { userId, categoryId, name, description } = req.body;

    // Validate required fields.
    if (
      userId === undefined ||
      categoryId === undefined ||
      !name ||
      name.trim() === ""
    ) {
      return res.status(400).json({
        message: "userId, categoryId, and name are required.",
      });
    }

    // Validate numeric IDs.
    if (
      isNaN(Number(userId)) ||
      isNaN(Number(categoryId))
    ) {
      return res.status(400).json({
        message: "userId and categoryId must be numeric.",
      });
    }

    // Prevent duplicate category names.
    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category name already exists.",
      });
    }

    // Create the category document.
    const category = new Category({
      userId: Number(userId),
      categoryId: Number(categoryId),
      name: name.trim(),
      description: description ? description.trim() : "",
    });

    // Save the category to MongoDB.
    const savedCategory = await category.save();

    return res.status(201).json(savedCategory);
  } catch (err) {
    console.error("Error creating category:", err);

    return res.status(500).json({
      message: "Error creating category.",
    });
  }
});

module.exports = router;