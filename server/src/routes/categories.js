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
 *
 *
 * Changes (Kaitlyn Kelly, 7/20/2026):
 * - Added GET /category/:categoryId to support reading a category by ID
 *
 *
 * Changes (Kaitlyn Kelly, 7/24/2026):
 * - Added GET to support fetching a count of all expenses within a category
 * - Used to confirm or deny deletion of a category
 */

"use strict";

console.log(">>> LOADED CATEGORIES ROUTER FROM:", __filename);


const express = require("express");
const Category = require("../models/Category");
const Expense = require("../models/Expense");
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
    if (isNaN(Number(userId)) || isNaN(Number(categoryId))) {
      return res.status(400).json({
        message: "userId and categoryId must be numeric.",
      });
    }

    // Prevent duplicate category names.
    const existingCategory = await Category.findOne({
      userId,
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


/*
 * GET /category/:categoryId
 * Retrieves number of expenses for a specific categoryId
 */

router.get('/:id/expenseCount', async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    // Find the category to get the correct userId
    const category = await Category.findOne({ categoryId });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const userId = category.userId;

    // Count only THIS user's expenses
    const count = await Expense.countDocuments({ userId, categoryId });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Error counting expenses' });
  }
});


/**
 * GET /category/:categoryId
 * Retrieves all expenses for a specific categoryId
 */
router.get("/category/:categoryId", async (req, res) => {
  try {
    const categoryId = Number(req.params.categoryId);

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "categoryId must be numeric." });
    }

    // Find the category to get the correct userId
    const category = await Category.findOne({ categoryId });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const userId = category.userId;

    // Fetch only this user's expenses
    const expenses = await Expense.find({ userId, categoryId });

    if (!expenses || expenses.length === 0) {
      return res
        .status(404)
        .json({ message: "No expenses found for this category." });
    }

    const enrichedExpenses = expenses.map((exp) => ({
      ...exp.toObject(),
      categoryName: category.name,
    }));

    return res.status(200).json(enrichedExpenses);
  } catch (err) {
    console.error("Error fetching expenses by category:", err);
    return res.status(500).json({
      message: "Error fetching expenses by category.",
      error: err.message,
    });
  }
});


/*
 * DELETE /:categoryId
 * Deletes a category based on categoryId
 */

router.delete('/:categoryId', async (req, res) => {
  try {
    const categoryId = Number(req.params.categoryId);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({ error: "Invalid categoryId" });
    }

    const deleted = await Category.deleteOne({ categoryId });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting category" });
  }
});

module.exports = router;
