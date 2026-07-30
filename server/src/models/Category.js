/**
 * Author: Jarren Bess
 * Date: 7/6/26
 * File: Category.js
 * Description: Mongoose schema/model for the Categories collection.
 */

"use strict";

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true },
    categoryId: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: { createdAt: "dateCreated", updatedAt: "dateModified" } },
);

// Category names and IDs are unique per user, not across all users.
categorySchema.index({ userId: 1, name: 1, categoryId: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
