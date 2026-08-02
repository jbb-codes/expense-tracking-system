/**
 * Author: Jarren Bess
 * Date: 7/6/26
 * File: db.js
 * Description: Mongoose connection helper for MongoDB Atlas.
 */

"use strict";

const mongoose = require("mongoose");
const Category = require("../models/Category");

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Category.syncIndexes();
  console.log("Connected to MongoDB");
}

module.exports = connectDB;
