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
 * GET /:id
 * Retrieves a single expense by its MongoDB _id
 */
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    return res.status(200).json(expense);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching expense.",
      error: err.message,
    });
  }
});
module.exports = router;
