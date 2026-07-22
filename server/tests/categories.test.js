/**
 * File: categories.test.js
 * Description: Unit tests for the List Categories API.
 */

"use strict";

const request = require("supertest");
const express = require("express");

const categoryRoutes = require("../src/routes/categories");
const Category = require("../src/models/Category");

// Mock the Category model so tests do not require MongoDB.
jest.mock("../src/models/Category");

const app = express();
app.use(express.json());
app.use("/api/categories", categoryRoutes);

let consoleErrorSpy;

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
  jest.clearAllMocks();
});

describe("GET /api/categories/user/:userId", () => {
  it("returns the categories belonging to the given userId", async () => {
    const categories = [
      { userId: 1000, categoryId: 1, name: "Groceries" },
      { userId: 1000, categoryId: 2, name: "Utilities" },
    ];

    Category.find.mockResolvedValue(categories);

    const res = await request(app).get("/api/categories/user/1000");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(categories);
    expect(Category.find).toHaveBeenCalledWith({ userId: 1000 });
  });

  it("returns 400 when userId is not numeric", async () => {
    const res = await request(app).get("/api/categories/user/abc");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("userId must be numeric.");
  });

  it("returns 500 when the database lookup fails", async () => {
    Category.find.mockRejectedValue(new Error("db down"));

    const res = await request(app).get("/api/categories/user/1000");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error fetching categories.");
  });
});
