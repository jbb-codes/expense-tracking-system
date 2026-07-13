/**
 * Author: Jarren Bess
 * Date: 7/6/26
 * File: Expense.js
 * Description: Mongoose schema/model for the Expenses collection.
 */

"use strict";

const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true },
    categoryId: { type: Number, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    /**
    * Amanda Ruff
    * Week 7 - Sprint 2
    * Added the expense date field so updated and newly created expenses
    * store the date required by the project specifications.
    */
    date: { type: Date, required: true },
  },
  { timestamps: { createdAt: "dateCreated", updatedAt: "dateModified" } },
);

module.exports = mongoose.model("Expense", expenseSchema);
