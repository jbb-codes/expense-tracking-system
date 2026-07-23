/**
 * File: requireAuth.test.js
 * Description: Unit tests for the requireAuth session middleware.
 */

"use strict";

const request = require("supertest");
const express = require("express");

const requireAuth = require("../src/middleware/requireAuth");

function buildApp(sessionUserId) {
  const app = express();

  // Fake a session object the way express-session would attach it.
  app.use((req, res, next) => {
    req.session = sessionUserId ? { userId: sessionUserId } : {};
    next();
  });

  app.get("/protected", requireAuth, (req, res) => {
    res.status(200).json({ userId: req.session.userId });
  });

  return app;
}

describe("requireAuth middleware", () => {
  test("rejects requests with no session userId with 401", async () => {
    const app = buildApp(undefined);

    const response = await request(app).get("/protected");

    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  test("allows requests through when session.userId is present", async () => {
    const app = buildApp(1000);

    const response = await request(app).get("/protected");

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(1000);
  });
});
