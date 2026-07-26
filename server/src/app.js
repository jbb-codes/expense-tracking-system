/**
 * Author: Jarren Bess
 * Date: 7/6/26
 * Modified: Jarren Bess, 7/20/2026
 * File: app.js
 * Description: Express application setup.
 *
 * Changes (Jarren Bess, 7/20/2026):
 * - Added the List All Categories API route, mounted under /api/categories.
 */

"use strict";

const express = require("express");
const cors = require("cors");
const expenseRoutes = require("./routes/expenses");
const categoryRoutes = require("./routes/categories");
const authRoutes = require("./routes/auth");

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
 * Jarren Bess
 * Week 8 - Sprint 3
 * Added the List All Categories API route for the Expense Tracking System.
 * This route handles GET requests for listing a user's category records.
 */
app.use("/api/categories", categoryRoutes);

/**
 * Kaitlyn Kelly
 * Week 6 - Sprint 1
 * Added the authentication API route for the Expense Tracking System.
 * This mounts all auth-related endpoints (e.g., login) under /api/auth.
 */
app.use("/api/auth", authRoutes);

module.exports = app;
