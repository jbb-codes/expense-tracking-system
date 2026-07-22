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
 *
 * Changes (Kaitlyn Kelly, 7/14/2026):
 * - Added DELETE /:id to support deleting an expense by its MongoDB _id
 *
 * Changes (Kaitlyn Kelly, 7/20/2026):
 * - Added GET /category/:categoryId to support reading a category by ID
 */

"use strict";

const express = require("express");
const Expense = require("../models/Expense");
const Category = require("../models/Category");
const router = express.Router();

/**
 * Enriches a list of expenses with categoryName, looked up in a single
 * batched Category query keyed by userId + categoryId (avoids N+1 lookups).
 */
async function enrichExpensesWithCategoryName(expenses) {
  const categories = await Category.find({
    userId: { $in: expenses.map((expense) => expense.userId) },
    categoryId: { $in: expenses.map((expense) => expense.categoryId) },
  });

  return expenses.map((expense) => {
    const category = categories.find(
      (candidate) =>
        candidate.userId === expense.userId &&
        candidate.categoryId === expense.categoryId,
    );

    return {
      ...(expense.toObject ? expense.toObject() : expense),
      categoryName: category ? category.name : "Unknown",
    };
  });
}

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

    const category = await Category.findOne({
      categoryId: Number(categoryId),
      userId: Number(userId),
    });

    if (!category) {
      return res.status(400).json({
        message: "categoryId must belong to the same userId.",
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
    console.error("Error creating expense:", err);
    return res.status(500).json({ message: "Error creating expense." });
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

    // Confirm the submitted categoryId belongs to the submitted userId.
    const category = await Category.findOne({
      categoryId: Number(categoryId),
      userId: Number(userId),
    });

    if (!category) {
      return res.status(400).json({
        message: "categoryId must belong to the same userId.",
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
    console.error("Error updating expense:", err);
    return res.status(500).json({ message: "Error updating expense." });
  }
});

/**
 * @description
 *
 * GET /?userId=
 *
 * Retrieves all expense records belonging to the given userId.
 * userId is required; missing or non-numeric values return 400.
 *
 * Example:
 * fetch('/api/expenses?userId=1000')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get("/", async (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "userId must be numeric." });
    }

    const expenses = await Expense.find({ userId });
    const enrichedExpenses = await enrichExpensesWithCategoryName(expenses);
    return res.status(200).json(enrichedExpenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    return res.status(500).json({ message: "Error fetching expenses." });
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

    // Fetch all expenses with this categoryId
    const expenses = await Expense.find({ categoryId });

    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found for this category." });
    }

    // Get userId from the first expense
    const userId = expenses[0].userId;

    // Fetch the category for THIS user
    const category = await Category.findOne({ userId, categoryId });

    const enrichedExpenses = expenses.map(exp => ({
      ...exp.toObject(),
      categoryName: category ? category.name : "Unknown"
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
    console.error("Error fetching expense:", err);
    return res.status(500).json({ message: "Error fetching expense." });
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

    const enrichedExpenses = await enrichExpensesWithCategoryName(expenses);
    return res.status(200).json(enrichedExpenses);
  } catch (err) {
    console.error("Error searching expenses:", err);
    return res.status(500).json({ message: "Error searching expenses." });
  }
});

// Delete an expense by its MongoDB _id
router.delete("/:id", async (req, res) => {
  try {
    // Attempt to delete the expense document matching the provided _id
    const deleted = await Expense.findByIdAndDelete(req.params.id);

    // No matching document found: return 404 so the client knows the ID was invalid
    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Successful deletion — return confirmation message
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Server error deleting expense" });
  }
});

module.exports = router;
