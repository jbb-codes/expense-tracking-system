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
 *
 * Changes (Amanda Ruff, 7/27/2026):
 * - Added three unit tests for the Update Category API.
 * - Added test coverage for successful updates, missing categories,
 *   and duplicate category name prevention.
 * - Updated the existing no-expenses test to mock the category lookup.
 */

"use strict";

const request = require("supertest");
const express = require("express");
const categoryRoutes = require("../src/routes/categories");
const Expense = require("../src/models/Expense");
const Category = require("../src/models/Category");

// Mock the Category and Expense models so the tests do not require MongoDB.
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
  /**
   * Confirms that all categories are returned for a valid userId.
   */
  test("should return all categories for a valid userId", async () => {
    // Create a mock for the chained Mongoose sort operation.
    const sortMock = jest.fn().mockResolvedValue([
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

    // Simulate Category.find returning a query with a sort method.
    Category.find.mockReturnValue({
      sort: sortMock,
    });

    // Send a request using a valid userId.
    const response = await request(app).get(
      "/api/categories?userId=1000",
    );

    // Confirm that the API returned the expected category records.
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("Food");

    // Verify that the database query was scoped to the correct user.
    expect(Category.find).toHaveBeenCalledWith({
      userId: 1000,
    });

    // Verify that the categories were sorted by categoryId.
    expect(sortMock).toHaveBeenCalledWith({
      categoryId: 1,
    });
  });

  /**
   * Confirms that a missing or non-numeric userId is rejected.
   */
  test("should return 400 when userId is missing or non-numeric", async () => {
    // Send a request without the required userId query parameter.
    const response = await request(app).get("/api/categories");

    // Confirm that the correct validation response was returned.
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "userId must be numeric.",
    );
  });

  /**
   * Confirms that database failures return a server error response.
   */
  test("should return 500 when an error occurs while fetching categories", async () => {
    // Simulate a database error during the sorted category query.
    Category.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(
        new Error("Database error"),
      ),
    });

    // Send a valid category-list request.
    const response = await request(app).get(
      "/api/categories?userId=1000",
    );

    // Confirm that the API returned a server error response.
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe(
      "Error fetching categories.",
    );
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
    // Define the category information sent in the request.
    const categoryData = {
      userId: 1000,
      categoryId: 5,
      name: "Transportation",
      description: "Gas, transit, and vehicle expenses",
    };

    // Define the category document returned after saving.
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

    // Send the category information to the API.
    const response = await request(app)
      .post("/api/categories")
      .send(categoryData);

    // Confirm that the category was created successfully.
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(savedCategory);
    expect(response.body.name).toBe("Transportation");
    expect(response.body.userId).toBe(1000);

    // Verify that duplicate-name validation was scoped to the user.
    expect(Category.findOne).toHaveBeenCalledWith({
      userId: 1000,
      name: "Transportation",
    });

    // Verify that the Category model received the correct data.
    expect(Category).toHaveBeenCalledWith(categoryData);
  });

  /**
   * Confirms that the API rejects a request when required
   * category information is missing.
   */
  test("should return 400 when required fields are missing", async () => {
    // Send a request that is missing categoryId and name.
    const response = await request(app)
      .post("/api/categories")
      .send({
        userId: 1000,
        description: "Category is missing an ID and name",
      });

    // Confirm that the correct validation response was returned.
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "userId, categoryId, and name are required.",
    );

    // Verify that the database was not queried after validation failed.
    expect(Category.findOne).not.toHaveBeenCalled();
  });

  /**
   * Confirms that the API prevents the creation of a category
   * when its name already exists.
   */
  test("should return 409 when the category name already exists", async () => {
    // Simulate finding an existing category with the same name.
    Category.findOne.mockResolvedValue({
      _id: "existing-category-id",
      userId: 1000,
      categoryId: 5,
      name: "Transportation",
      description: "Existing transportation category",
    });

    // Attempt to create another category with the duplicate name.
    const response = await request(app)
      .post("/api/categories")
      .send({
        userId: 1000,
        categoryId: 6,
        name: "Transportation",
        description: "Another transportation category",
      });

    // Confirm that the duplicate category was rejected.
    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe(
      "Category name already exists.",
    );

    // Verify that a new Category document was not created.
    expect(Category).not.toHaveBeenCalled();
  });
});

/**
 * Amanda Ruff
 * Week 9 - Sprint 4
 *
 * Unit tests for the Update Category API.
 * These tests verify successful category updates, missing-category
 * handling, and duplicate category name prevention.
 */
describe("PUT /api/categories/:categoryId", () => {
  /**
   * Confirms that an existing category is updated when valid
   * category information is provided.
   */
  test("should update a category when valid data is provided", async () => {
    // Create a mock category document representing the existing record.
    const existingCategory = {
      _id: "category-object-id",
      userId: 1000,
      categoryId: 5,
      name: "Transportation",
      description: "Original description",
      save: jest.fn(),
    };

    // Define the expected category data after the update.
    const updatedCategory = {
      _id: "category-object-id",
      userId: 1000,
      categoryId: 5,
      name: "Vehicle Expenses",
      description: "Gas, repairs, and vehicle maintenance",
    };

    // Simulate locating the category that will be updated.
    Category.findOne.mockResolvedValueOnce(existingCategory);

    // Simulate finding no other category with the requested name.
    Category.findOne.mockResolvedValueOnce(null);

    // Simulate successfully saving the updated category.
    existingCategory.save.mockResolvedValue(updatedCategory);

    // Send the update request to the API.
    const response = await request(app)
      .put("/api/categories/5")
      .send({
        name: "Vehicle Expenses",
        description: "Gas, repairs, and vehicle maintenance",
      });

    // Confirm that the API returned a successful response.
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(updatedCategory);
    expect(response.body.name).toBe("Vehicle Expenses");

    // Verify that the API searched for the correct category.
    expect(Category.findOne).toHaveBeenNthCalledWith(1, {
      categoryId: 5,
    });

    // Verify that duplicate-name validation was scoped to the same user
    // while excluding the category currently being updated.
    expect(Category.findOne).toHaveBeenNthCalledWith(2, {
      userId: 1000,
      name: "Vehicle Expenses",
      categoryId: {
        $ne: 5,
      },
    });

    // Verify that the updated category was saved.
    expect(existingCategory.save).toHaveBeenCalledTimes(1);
  });

  /**
   * Confirms that the API returns 404 when the supplied
   * categoryId does not match an existing category.
   */
  test("should return 404 when the category does not exist", async () => {
    // Simulate MongoDB finding no matching category.
    Category.findOne.mockResolvedValue(null);

    // Send an update request using a categoryId that does not exist.
    const response = await request(app)
      .put("/api/categories/999")
      .send({
        name: "Unknown Category",
        description: "This category does not exist",
      });

    // Confirm that the correct not-found response was returned.
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      "Category not found.",
    );

    // Verify that the API searched for the supplied categoryId.
    expect(Category.findOne).toHaveBeenCalledWith({
      categoryId: 999,
    });
  });

  /**
   * Confirms that the API prevents an update when another category
   * belonging to the same user already has the requested name.
   */
  test("should return 409 when the updated category name already exists", async () => {
    // Create a mock category representing the record being updated.
    const existingCategory = {
      _id: "category-object-id",
      userId: 1000,
      categoryId: 5,
      name: "Transportation",
      description: "Original description",
      save: jest.fn(),
    };

    // Create a second category with the requested duplicate name.
    const duplicateCategory = {
      _id: "duplicate-category-id",
      userId: 1000,
      categoryId: 6,
      name: "Food",
      description: "Food and beverage expenses",
    };

    // Simulate locating the category being updated.
    Category.findOne.mockResolvedValueOnce(existingCategory);

    // Simulate locating another category with the requested name.
    Category.findOne.mockResolvedValueOnce(duplicateCategory);

    // Send an update request containing the duplicate name.
    const response = await request(app)
      .put("/api/categories/5")
      .send({
        name: "Food",
        description: "Updated category description",
      });

    // Confirm that the duplicate category name was rejected.
    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe(
      "Category name already exists.",
    );

    // Verify that the category was not saved after validation failed.
    expect(existingCategory.save).not.toHaveBeenCalled();
  });
});

/**
 * Kaitlyn Kelly
 * Week 8 - Sprint 3
 *
 * Unit tests for the Read Category by ID API.
 */
describe("GET /api/categories/category/:categoryId", () => {
  /**
   * Confirms that a non-numeric categoryId is rejected.
   */
  test("should return 400 when categoryId is not numeric", async () => {
    // Send a request containing an invalid categoryId.
    const response = await request(app).get(
      "/api/categories/category/abc",
    );

    // Confirm that the correct validation response was returned.
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "categoryId must be numeric.",
    );
  });

  /**
   * Confirms that the API returns 404 when the category exists
   * but no expenses are assigned to it.
   */
  test("should return 404 when no expenses exist for this category", async () => {
    // Simulate finding the requested category.
    Category.findOne.mockResolvedValue({
      userId: 123,
      categoryId: 5,
      name: "Travel",
    });

    // Simulate finding no expenses assigned to the category.
    Expense.find.mockResolvedValue([]);

    // Send a request for a valid category that has no expenses.
    const response = await request(app).get(
      "/api/categories/category/5",
    );

    // Confirm that the API returned the expected not-found response.
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "No expenses found for this category.",
    );
  });

  /**
   * Confirms that the API returns all expenses assigned
   * to a valid category.
   */
  test("should return 200 and the expenses for a valid category", async () => {
    // Simulate finding the requested category.
    Category.findOne.mockResolvedValue({
      userId: 123,
      categoryId: 2,
      name: "Travel",
    });

    // Simulate finding two expenses assigned to the category.
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

    // Send a request for the valid category.
    const response = await request(app).get(
      "/api/categories/category/2",
    );

    // Confirm that both expenses were returned.
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]._id).toBe("exp1");
    expect(response.body[1]._id).toBe("exp2");

    // Confirm that the category name was added to each expense.
    expect(response.body[0].categoryName).toBe("Travel");
    expect(response.body[1].categoryName).toBe("Travel");

    // Verify that expenses were queried using the correct IDs.
    expect(Expense.find).toHaveBeenCalledWith({
      userId: 123,
      categoryId: 2,
    });
  });
});

/**
 * Kaitlyn Kelly
 * Week 9 - Sprint 4
 *
 * Unit tests for the Delete Category API.
 */
describe("DELETE /api/categories/:categoryId", () => {
  /**
   * Confirms that an existing category is successfully deleted.
   */
  test("should return 200 when a category is successfully deleted", async () => {
    // Simulate successfully deleting one category document.
    Category.deleteOne.mockResolvedValue({
      deletedCount: 1,
    });

    // Send a delete request using a valid categoryId.
    const response = await request(app).delete(
      "/api/categories/3",
    );

    // Confirm that the category was deleted successfully.
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Category deleted successfully",
    });

    // Verify that the correct categoryId was used in the delete query.
    expect(Category.deleteOne).toHaveBeenCalledWith({
      categoryId: 3,
    });
  });

  /**
   * Confirms that the API returns 404 when the category
   * does not exist.
   */
  test("should return 404 when the category does not exist", async () => {
    // Simulate deleting no category documents.
    Category.deleteOne.mockResolvedValue({
      deletedCount: 0,
    });

    // Send a delete request using a categoryId that does not exist.
    const response = await request(app).delete(
      "/api/categories/999",
    );

    // Confirm that the correct not-found response was returned.
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Category not found",
    });
  });

  /**
   * Confirms that an invalid categoryId is rejected.
   */
  test("should return 400 for an invalid categoryId", async () => {
    // Send a delete request containing an invalid categoryId.
    const response = await request(app).delete(
      "/api/categories/-1",
    );

    // Confirm that the correct validation response was returned.
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Invalid categoryId",
    });

    // Verify that the database was not queried after validation failed.
    expect(Category.deleteOne).not.toHaveBeenCalled();
  });
});