/**
 * Author: Jarren Bess
 * Week 8 - Sprint 3
 * File: categories.test.js
 * Description: Unit tests for the List All Categories API.
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

describe("GET /api/categories", () => {
  // Confirm the list view has real data to render when categories exist.
  test("should return all categories for a valid userId", async () => {
    Category.find.mockResolvedValue([
      {
        _id: "1",
        userId: 1000,
        categoryId: 1,
        name: "Food",
        description: "Food and beverages",
      },
      {
        _id: "2",
        userId: 1000,
        categoryId: 2,
        name: "Transport",
        description: "Gas and transit",
      },
    ]);

    const response = await request(app).get("/api/categories?userId=1000");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("Food");
    expect(Category.find).toHaveBeenCalledWith({ userId: 1000 });
  });

  // Ensure userId is required to keep results scoped to a single user.
  test("should return 400 when userId is missing or non-numeric", async () => {
    const response = await request(app).get("/api/categories");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("userId must be numeric.");
  });

  // Ensure a database failure returns a clear server error.
  test("should return 500 when an error occurs while fetching categories", async () => {
    Category.find.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/api/categories?userId=1000");

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Error fetching categories.");
  });
});
