/**
 * Author: Amanda Ruff
 * Date: 7/6/26
 * File: expenses.js
 * Description: API routes for creating expenses.
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

module.exports = router;