/**
 * Author: Amanda Ruff
 * Date: 7/6/26
 * Modified: Jarren Bess, 7/7/2026
 * File: expenses.js
 * Description: API routes for creating and listing expenses.
 *
 * Changes (Jarren Bess, 7/7/2026):
 * - Added GET / so the client's expense list view can load existing records
 *   instead of only being able to submit new ones.
 *
 * Changes (Kaitlyn Kelly, 7/10/2026):
 * - Added GET /user/:userId to support loading expenses for a specific user
 * - Added GET /:id to support loading a single expense by its MonogoDB _id
 */

"use strict";

const express = require("express");
const Expense = require("../models/Expense");
const Category = require("../models/Category");
const router = express.Router();

/**
 * Amanda Ruff
 * Week 6 - Sprint 1
 * Creates a new expense record.
 */
router.post("/", async (req, res) => {
  try {
    const { userId, categoryId, amount, description, date } = req.body;

    if (!userId || !categoryId || amount === undefined || !date) {
      return res.status(400).json({
        message: "userId, categoryId, amount, and date are required.",
      });
    }

    if (isNaN(userId) || isNaN(categoryId)) {
      return res.status(400).json({
        message: "userId and categoryId must be numeric values.",
      });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero.",
      });
    }

    const expense = await Expense.create({
      userId,
      categoryId,
      amount: Number(amount),
      description,
      date,
    });

    return res.status(201).json(expense);
  } catch (err) {
    return res.status(500).json({
      message: "Error creating expense.",
      error: err.message,
    });
  }
});

/**
 * Amanda Ruff
 * Week 7 - Sprint 2
 * Updates an existing expense using the MongoDB expense ID.
 * This route validates the submitted values and returns the updated record.
 */
router.put("/:id", async (req, res) => {
  try {
    // Amanda Ruff: Retrieve the editable expense values from the request body.
    const { userId, categoryId, amount, description, date } = req.body;

    // Amanda Ruff: Verify that all required expense fields were submitted.
    if (!userId || !categoryId || amount === undefined || !date) {
      return res.status(400).json({
        message: "userId, categoryId, amount, and date are required.",
      });
    }

    // Amanda Ruff: Ensure the user and category identifiers are numeric values.
    if (isNaN(userId) || isNaN(categoryId)) {
      return res.status(400).json({
        message: "userId and categoryId must be numeric values.",
      });
    }

    // Amanda Ruff: Prevent zero, negative, or nonnumeric expense amounts.
    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero.",
      });
    }

    // Amanda Ruff: Update the expense and return the modified record.
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        userId: Number(userId),
        categoryId: Number(categoryId),
        amount: Number(amount),
        description,
        date,
        dateModified: new Date(),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    // Amanda Ruff: Return 404 when no expense matches the submitted ID.
    if (!updatedExpense) {
      return res.status(404).json({
        message: "Expense not found.",
      });
    }

    return res.status(200).json(updatedExpense);
  } catch (err) {
    // Amanda Ruff: Return a server error when the update operation fails.
    return res.status(500).json({
      message: "Error updating expense.",
      error: err.message,
    });
  }
});

/**
 * @description
 *
 * GET /
 *
 * Retrieves all expense records.
 *
 * Example:
 * fetch('/api/expenses')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    return res.status(200).json(expenses);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching expenses.",
      error: err.message,
    });
  }
});

/**
 * GET /:id
 * Retrieves a single expense by its MongoDB _id
 */
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    // Fetch category for this expense
    const category = await Category.findOne({
      userId: expense.userId,
      categoryId: expense.categoryId,
    });

    // Enrich the expense with categoryName
    const enrichedExpense = {
      ...expense.toObject(),
      categoryName: category ? category.name : "Unknown",
    };

    return res.status(200).json(enrichedExpense);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching expense.",
      error: err.message,
    });
  }
});

/**
 * GET /user/:userId
 * Retrieves all expenses for a specific user
 */

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "userId must be numeric." });
    }

    const expenses = await Expense.find({ userId });
    return res.status(200).json(expenses);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching user expenses",
      error: err.message,
    });
  }
});

/**
 * @description
 *
 * GET /user/:userId/search
 *
 * Searches a user's expenses by a case-insensitive description match.
 *
 * Example:
 * fetch('/api/expenses/user/1000/search?description=lunch')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get("/user/:userId/search", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "userId must be numeric." });
    }

    const { description } = req.query;

    const expenses = await Expense.find({
      userId,
      description: { $regex: description || "", $options: "i" },
    });

    return res.status(200).json(expenses);
  } catch (err) {
    return res.status(500).json({
      message: "Error searching expenses.",
      error: err.message,
    });
  }
});

module.exports = router;
