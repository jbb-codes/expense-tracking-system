/**
 * Author: Jarren Bess
 * Week 8 - Sprint 3
 * File: categories.test.js
 * Description: Unit tests for the Categories API.
 *
 * Changes (Amanda Ruff, 7/20/2026):
 * - Fixed formatting and syntax issues after merging.
 * - Added three unit tests for the Create Category API.
 * - Added test coverage for successful creation, missing fields,
 *   and duplicate category names.
 */

"use strict";

const request = require("supertest");
const express = require("express");
const categoryRoutes = require("../src/routes/categories");
const Expense = require("../src/models/Expense");
const Category = require("../src/models/Category");

// Mock the Category and Expense model so the tests do not require MongoDB.
jest.mock("../src/models/Category");
jest.mock("../src/models/Expense");

// Create a small Express application for testing the category routes.
const app = express();
app.use(express.json());
app.use("/api/categories", categoryRoutes);

let consoleErrorSpy;

/**
 * Runs before each test.
 * Prevents expected error messages from cluttering the Jest output.
 */
beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

/**
 * Runs after each test.
 * Restores console.error and clears all mock call history.
 */
afterEach(() => {
  consoleErrorSpy.mockRestore();
  jest.clearAllMocks();
});

/**
 * Jarren Bess
 * Week 8 - Sprint 3
 *
 * Unit tests for the List All Categories API.
 */
describe("GET /api/categories", () => {
  // Confirm that categories are returned for a valid user ID.
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

    // Verify that the database query was scoped to the correct user.
    expect(Category.find).toHaveBeenCalledWith({
      userId: 1000,
    });
  });

  // Ensure that an invalid or missing user ID is rejected.
  test("should return 400 when userId is missing or non-numeric", async () => {
    const response = await request(app).get("/api/categories");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("userId must be numeric.");
  });

  // Ensure that database failures return a server error response.
  test("should return 500 when an error occurs while fetching categories", async () => {
    Category.find.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/api/categories?userId=1000");

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Error fetching categories.");
  });
});

/**
 * Amanda Ruff
 * Week 8 - Sprint 3
 *
 * Unit tests for the Create Category API.
 * These tests verify successful category creation,
 * required-field validation, and duplicate prevention.
 */
describe("POST /api/categories", () => {
  /**
   * Confirms that a category is created when all required
   * information is valid.
   */
  test("should create a category when valid data is provided", async () => {
    const categoryData = {
      userId: 1000,
      categoryId: 5,
      name: "Transportation",
      description: "Gas, transit, and vehicle expenses",
    };

    const savedCategory = {
      _id: "category-object-id",
      ...categoryData,
    };

    // Simulate finding no existing category with the same name.
    Category.findOne.mockResolvedValue(null);

    // Simulate creating and saving a new Mongoose category document.
    Category.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(savedCategory),
    }));

    const response = await request(app)
      .post("/api/categories")
      .send(categoryData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(savedCategory);
    expect(response.body.name).toBe("Transportation");
    expect(response.body.userId).toBe(1000);

    // Verify that the route checked for a duplicate name scoped to the user.
    expect(Category.findOne).toHaveBeenCalledWith({
      userId: 1000,
      name: "Transportation",
    });

    // Verify that the Category model was created with the correct data.
    expect(Category).toHaveBeenCalledWith(categoryData);
  });

  /**
   * Confirms that the API rejects a request when required
   * category information is missing.
   */
  test("should return 400 when required fields are missing", async () => {
    const response = await request(app).post("/api/categories").send({
      userId: 1000,
      description: "Category is missing an ID and name",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "userId, categoryId, and name are required.",
    );

    // The database should not be queried when validation fails.
    expect(Category.findOne).not.toHaveBeenCalled();
  });

  /**
   * Confirms that the API prevents the creation of a category
   * when its name already exists.
   */
  test("should return 409 when the category name already exists", async () => {
    Category.findOne.mockResolvedValue({
      _id: "existing-category-id",
      userId: 1000,
      categoryId: 5,
      name: "Transportation",
      description: "Existing transportation category",
    });

    const response = await request(app).post("/api/categories").send({
      userId: 1000,
      categoryId: 6,
      name: "Transportation",
      description: "Another transportation category",
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe("Category name already exists.");

    // A new category should not be created when a duplicate exists.
    expect(Category).not.toHaveBeenCalled();
  });
});

/**
 * Kaitlyn Kelly
 * Week 8 - Sprint 3
 * Unit tests for the GET category id API.
 */

describe("GET /api/categories/category/:categoryId", () => {
  // Should return 400 when categoryId is not numeric
  it("should return 400 when categoryId is not numeric", async () => {
    const res = await request(app).get("/api/categories/category/abc");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("categoryId must be numeric.");
  });

  // Should return 404 when no expenses exist for category
  it("should return 404 when no expenses exist for this category", async () => {
    Expense.find.mockResolvedValue([]); // no expenses found

    const res = await request(app).get("/api/categories/category/5");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No expenses found for this category.");
  });

  // Should return 200 and basic expenses list
  it("should return 200 and the expenses for a valid category", async () => {
    Expense.find.mockResolvedValue([
      {
        _id: "exp1",
        userId: 123,
        categoryId: 2,
        amount: 50,
        description: "Test expense",
        date: "2024-01-01",
        toObject() {
          return {
            _id: "exp1",
            userId: 123,
            categoryId: 2,
            amount: 50,
            description: "Test expense",
            date: "2024-01-01",
          };
        },
      },
      {
        _id: "exp2",
        userId: 123,
        categoryId: 2,
        amount: 75,
        description: "Another expense",
        date: "2024-01-02",
        toObject() {
          return {
            _id: "exp2",
            userId: 123,
            categoryId: 2,
            amount: 75,
            description: "Another expense",
            date: "2024-01-02",
          };
        },
      },
    ]);

    // Category lookup mocked but not asserted
    Category.findOne.mockResolvedValue({ name: "Travel" });

    const res = await request(app).get("/api/categories/category/2");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]._id).toBe("exp1");
    expect(res.body[1]._id).toBe("exp2");
  });
});

/**
 * Kaitlyn Kelly
 * Week 9 - Sprint 3
 * Unit tests for the DELETE category id API.
 */

describe('DELETE /api/categories/:categoryId', () => {

  // should return a 200 and delete the category
  it("should return 200 when a category is successfully deleted", async () => {
    Category.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const response = await request(app).delete("/api/categories/3");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Category deleted successfully" });
  });

  // should return a 404 and display not found error message
  it("should return 404 when the category does not exist", async () => {
      Category.deleteOne.mockResolvedValue({ deletedCount: 0 });

      const response = await request(app).delete("/api/categories/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Category not found" });
    });

  // should return a 400 and display invalid error message
  it("should return 400 for an invalid categoryId", async () => {
  const response = await request(app).delete("/api/categories/-1");

    expect(response.status).toBe(400);
   expect(response.body).toEqual({ error: "Invalid categoryId" });
  });

});

