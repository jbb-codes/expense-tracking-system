/**
 * Author: Kaitlyn Kelly
 * Date: 7/10/26
 * File: auth.js
 * Description: API route for user login using username + password.
 */

"use strict";

const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

/**
 * POST /auth/login
 * Validates a user's credentials.
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    req.session.userId = user.userId;

    return res.status(200).json({
      message: "Login successful.",
      userId: user.userId,
      username: user.username,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error during login.",
      error: err.message,
    });
  }
});

/**
 * POST /auth/logout
 * Destroys the authenticated session.
 */
router.post("/logout", (req, res) => {
  if (!req.session) {
    return res.status(200).json({ message: "Logged out." });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error during logout." });
    }

    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logged out." });
  });
});

module.exports = router;
