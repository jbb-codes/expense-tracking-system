/**
 * File: auth.test.js
 * Description: Integration tests for session-backed login/logout and for
 * requireAuth guarding protected routes end-to-end through the real app.
 */

"use strict";

Object.assign(process.env, { SESSION_SECRET: "test-only-value" });

const request = require("supertest");
const bcrypt = require("bcryptjs");

const app = require("../src/app");
const User = require("../src/models/User");

jest.mock("../src/models/User");
jest.mock("../src/models/Expense", () => ({
  find: jest.fn().mockResolvedValue([]),
}));
jest.mock("../src/models/Category", () => ({
  find: jest.fn().mockResolvedValue([]),
}));

let consoleErrorSpy;

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
  jest.clearAllMocks();
});

async function loginAgent() {
  const agent = request.agent(app);
  const hashed = await bcrypt.hash("correct-password", 10);

  User.findOne.mockResolvedValue({
    userId: 1000,
    username: "amanda",
    password: hashed,
  });

  const response = await agent
    .post("/api/auth/login")
    .send({ username: "amanda", password: "correct-password" });

  return { agent, response };
}

describe("POST /api/auth/login", () => {
  test("establishes a session cookie on success", async () => {
    const { response } = await loginAgent();

    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("a session established by login can access a protected route", async () => {
    const { agent } = await loginAgent();

    const protectedResponse = await agent.get("/api/expenses?userId=1000");

    expect(protectedResponse.status).toBe(200);
  });
});

describe("protected routes without a session", () => {
  test("reject with 401", async () => {
    const response = await request(app).get("/api/expenses?userId=1000");

    expect(response.status).toBe(401);
  });
});

describe("POST /api/auth/logout", () => {
  test("destroys the session so protected routes reject afterward", async () => {
    const { agent } = await loginAgent();

    const logoutResponse = await agent.post("/api/auth/logout");
    expect(logoutResponse.status).toBe(200);

    const protectedResponse = await agent.get("/api/expenses?userId=1000");
    expect(protectedResponse.status).toBe(401);
  });
});
