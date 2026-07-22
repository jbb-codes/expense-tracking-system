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
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");

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

/**
 * Kaitlyn Kelly
 * Week 6 - Sprint 1
 * Added the authentication API route for the Expense Tracking System.
 * This mounts all auth-related endpoints (e.g., login) under /api/auth.
 */
app.use("/api/auth", authRoutes);

/**
 * Mounts the categories API used to populate category-name
 * dropdowns (e.g., in the Create/Update Expense forms).
 */
app.use("/api/categories", categoryRoutes);

module.exports = app;
