/**
 * Author: Jarren Bess
 * Date: 7/6/26
 * File: User.js
 * Description: Mongoose schema/model for the Users collection.
 */

"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: { createdAt: "dateCreated", updatedAt: "dateModified" } },
);

module.exports = mongoose.model("User", userSchema);
