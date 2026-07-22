/**
 * File: session.js
 * Description: Builds the express-session middleware backed by MongoDB
 * (connect-mongo) in normal use, falling back to the in-memory store
 * during tests so the suite does not require a live database.
 */

"use strict";

const session = require("express-session");
const MongoStore = require("connect-mongo");

function createSessionMiddleware() {
  const isTest = process.env.NODE_ENV === "test";

  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: isTest
      ? undefined
      : MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  });
}

module.exports = createSessionMiddleware;
