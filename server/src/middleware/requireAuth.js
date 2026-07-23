/**
 * File: requireAuth.js
 * Description: Express middleware that rejects requests with no
 * authenticated session, so protected routes can trust req.session.userId.
 */

"use strict";

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  return next();
}

module.exports = requireAuth;
