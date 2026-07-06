/**
 * Author: Jarren Bess
 * Date: 7/6/26
 * File: app.js
 * Description: Express application setup.
 */

"use strict";

const express = require("express");
const cors = require("cors");
const expenseRoutes = require("./routes/expenses");

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Amanda Ruff
 * Week 6 - Sprint 1
 * Added the Create Expense API route for the Expense Tracking System.
 * This route handles POST requests for creating new expense records.
 */
app.use("/api/expenses", expenseRoutes);

module.exports = app;