/**
 * Author: Amanda Ruff
 * Date: 7/6/26
 * Modified: Jarren Bess, 7/7/2026
 * Modified: Kaitlyn Kelly, 7/11/2026
 * Modified: Amanda Ruff, 7/12/2026
 * File: expenses.test.js
 * Description: Unit tests for the Create, Update, Read, and List Expenses APIs.
 *
 * Changes (Jarren Bess, 7/7/2026):
 * - Added tests for GET / so the new list-all-expenses endpoint has the same
 *   coverage as the existing create endpoint before it ships.
 *
 * Changes (Kaitlyn Kelly, 7/11/2026):
 * - Added tests for reading an expense by ID.
 *
 * Changes (Amanda Ruff, 7/12/2026):
 * - Added three unit tests for the Update Expense API.
 * - Tests successful updates, invalid update data, and missing expenses.
 */

"use strict";

const request = require("supertest");
const express = require("express");

const expenseRoutes = require("../src/routes/expenses");
const Expense = require("../src/models/Expense");
const Category = require("../src/models/Category");

// Mock the Expense and Category models so tests do not require MongoDB.
jest.mock("../src/models/Expense");
jest.mock("../src/models/Category");

// Create a small Express application for testing the expense routes.
const app = express();
app.use(express.json());
app.use("/api/expenses", expenseRoutes);

// Suppress console.error noise from the routes' error-logging paths;
// the 500-response tests intentionally trigger it.
let consoleErrorSpy;

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

/**
 * Amanda Ruff
 * Week 6 - Sprint 1
 * Unit tests for the Create Expense API.
 */
describe("POST /api/expenses", () => {
  afterEach(() => {
    // Clear all mocked model calls after each test.
    jest.clearAllMocks();
  });

  test("should create an expense successfully", async () => {
    Category.findOne.mockResolvedValue({ categoryId: 1, userId: 1000 });
    Expense.create.mockResolvedValue({
      _id: "123",
      userId: 1000,
      categoryId: 1,
      amount: 25.5,
      description: "Lunch",
      date: "2026-07-06",
    });

    const response = await request(app).post("/api/expenses").send({
      userId: 1000,
      categoryId: 1,
      amount: 25.5,
      description: "Lunch",
      date: "2026-07-06",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.userId).toBe(1000);
  });

  test("should return 400 when categoryId does not belong to userId", async () => {
    Category.findOne.mockResolvedValue(null);

    const response = await request(app).post("/api/expenses").send({
      userId: 1000,
      categoryId: 999,
      amount: 25.5,
      description: "Lunch",
      date: "2026-07-06",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "categoryId must belong to the same userId.",
    );
    expect(Expense.create).not.toHaveBeenCalled();
  });

  test("should return 400 when required fields are missing", async () => {
    const response = await request(app).post("/api/expenses").send({
      amount: 20,
    });

    expect(response.statusCode).toBe(400);
  });

  test("should return 400 when amount is invalid", async () => {
    const response = await request(app).post("/api/expenses").send({
      userId: 1000,
      categoryId: 1,
      amount: -5,
      date: "2026-07-06",
    });

    expect(response.statusCode).toBe(400);
  });
});

/**
 * Amanda Ruff
 * Week 7 - Sprint 2
 * Unit tests for the Update Expense API.
 */
describe("PUT /api/expenses/:id", () => {
  afterEach(() => {
    // Amanda Ruff: Clear all model mocks after each update test.
    jest.clearAllMocks();
  });

  /**
   * Amanda Ruff
   * Verifies that valid expense information updates the selected record.
   */
  test("should update an expense successfully", async () => {
    Category.findOne.mockResolvedValue({ categoryId: 2, userId: 1000 });
    Expense.findByIdAndUpdate.mockResolvedValue({
      _id: "exp123",
      userId: 1000,
      categoryId: 2,
      amount: 75.5,
      description: "Updated grocery expense",
      date: "2026-07-12",
    });

    const response = await request(app).put("/api/expenses/exp123").send({
      userId: 1000,
      categoryId: 2,
      amount: 75.5,
      description: "Updated grocery expense",
      date: "2026-07-12",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe("exp123");
    expect(response.body.userId).toBe(1000);
    expect(response.body.categoryId).toBe(2);
    expect(response.body.amount).toBe(75.5);
    expect(response.body.description).toBe("Updated grocery expense");

    // Amanda Ruff: Confirm the correct expense ID and values were used.
    expect(Expense.findByIdAndUpdate).toHaveBeenCalledWith(
      "exp123",
      expect.objectContaining({
        userId: 1000,
        categoryId: 2,
        amount: 75.5,
        description: "Updated grocery expense",
        date: "2026-07-12",
        dateModified: expect.any(Date),
      }),
      {
        new: true,
        runValidators: true,
      },
    );
  });

  /**
   * Amanda Ruff
   * Verifies that an invalid amount prevents the expense from being updated.
   */
  test("should return 400 when update data is invalid", async () => {
    Category.findOne.mockResolvedValue({ categoryId: 2, userId: 1000 });

    const response = await request(app).put("/api/expenses/exp123").send({
      userId: 1000,
      categoryId: 2,
      amount: -10,
      description: "Invalid update",
      date: "2026-07-12",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Amount must be greater than zero.");

    // Amanda Ruff: Confirm the database update was never attempted.
    expect(Expense.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  /**
   * Amanda Ruff
   * Verifies that the API returns 404 when the expense does not exist.
   */
  test("should return 404 when expense to update is not found", async () => {
    Category.findOne.mockResolvedValue({ categoryId: 2, userId: 1000 });
    Expense.findByIdAndUpdate.mockResolvedValue(null);

    const response = await request(app).put("/api/expenses/doesNotExist").send({
      userId: 1000,
      categoryId: 2,
      amount: 25,
      description: "Updated expense",
      date: "2026-07-12",
    });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Expense not found.");
  });

  /**
   * Verifies that a categoryId belonging to a different userId is rejected.
   */
  test("should return 400 when categoryId does not belong to userId", async () => {
    Category.findOne.mockResolvedValue(null);

    const response = await request(app).put("/api/expenses/exp123").send({
      userId: 1000,
      categoryId: 999,
      amount: 75.5,
      description: "Updated grocery expense",
      date: "2026-07-12",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "categoryId must belong to the same userId.",
    );
    expect(Expense.findByIdAndUpdate).not.toHaveBeenCalled();
  });
});

/**
 * Jarren Bess
 * Week 6 - Sprint 1
 * Unit tests for the List All Expenses API.
 */
describe("GET /api/expenses", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Confirm the list view has real data to render when expenses exist.
  test("should return all expenses successfully", async () => {
    Expense.find.mockResolvedValue([
      {
        _id: "123",
        userId: 1000,
        categoryId: 1,
        amount: 25.5,
        description: "Lunch",
        date: "2026-07-06",
      },
      {
        _id: "456",
        userId: 1000,
        categoryId: 2,
        amount: 10.0,
        description: "Coffee",
        date: "2026-07-05",
      },
    ]);

    const response = await request(app).get("/api/expenses?userId=1000");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].userId).toBe(1000);
  });

  // Guard against a new collection breaking the endpoint before data exists.
  test("should return an empty array when no expenses exist", async () => {
    Expense.find.mockResolvedValue([]);

    const response = await request(app).get("/api/expenses?userId=1000");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  // Ensure a database failure returns a clear server error.
  test("should return 500 when an error occurs while fetching expenses", async () => {
    Expense.find.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/api/expenses?userId=1000");

    expect(response.statusCode).toBe(500);
  });

  // Ensure userId is required to keep results scoped to a single user.
  test("should return 400 when userId is missing or non-numeric", async () => {
    const response = await request(app).get("/api/expenses");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("userId must be numeric.");
  });
});

/**
 * Kaitlyn Kelly
 * Week 6 - Sprint 1
 * Unit tests for the Read Expense by ID API.
 */
describe("GET /api/expenses/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Verify that an expense and its category name are returned.
  test("should return an enriched expense by ID successfully", async () => {
    Expense.findById.mockResolvedValue({
      _id: "exp123",
      userId: 1000,
      categoryId: 1,
      amount: 45.99,
      description: "Weekly grocery run",
      date: "2026-06-01",
      toObject() {
        return this;
      },
    });

    Category.findOne.mockResolvedValue({
      name: "Groceries",
    });

    const response = await request(app).get("/api/expenses/exp123");

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe("exp123");
    expect(response.body.categoryName).toBe("Groceries");
  });

  // Verify that a missing expense returns a 404 response.
  test("should return 404 when expense is not found", async () => {
    Expense.findById.mockResolvedValue(null);

    const response = await request(app).get("/api/expenses/doesNotExist");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Expense not found.");
  });

  // Verify that a database failure returns a server error.
  test("should return 500 when an error occurs while fetching expense", async () => {
    Expense.findById.mockRejectedValue(new Error("Database failure"));

    const response = await request(app).get("/api/expenses/exp123");

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Error fetching expense.");
  });
});

/**
 * Jarren Bess
 * Week 7 - Sprint 2
 * Unit tests for the Search Expenses API.
 */
describe("GET /api/expenses/user/:userId/search", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Verify that expenses matching the description query are returned for a valid userId.
  test("should return matching expenses for a valid userId and description", async () => {
    Expense.find.mockResolvedValue([
      {
        _id: "1",
        userId: 1000,
        categoryId: 1,
        amount: 25.5,
        description: "Lunch with client",
        date: "2026-07-06",
      },
    ]);

    const response = await request(app).get(
      "/api/expenses/user/1000/search?description=lunch",
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(Expense.find).toHaveBeenCalledWith({
      userId: 1000,
      description: { $regex: "lunch", $options: "i" },
    });
  });

  // Verify that a nonnumeric user ID returns a validation error.
  test("should return 400 when userId is not numeric", async () => {
    const response = await request(app).get(
      "/api/expenses/user/notANumber/search?description=lunch",
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("userId must be numeric.");
  });

  // Verify that a database failure returns a server error.
  test("should return 500 when an error occurs while searching expenses", async () => {
    Expense.find.mockRejectedValue(new Error("DB error"));

    const response = await request(app).get(
      "/api/expenses/user/1000/search?description=lunch",
    );

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Error searching expenses.");
  });
});

/**
 * Kaitlyn Kelly
 * Week 7 - Sprint 2
 * Unit tests for the Delete Expense API.
 */
describe("DELETE /api/expenses/:id", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  //Verifies that a valid expense ID deletes the record successfully.
  test("should delete an expense successfully", async () => {
    // Mock a successful deletion
    Expense.findByIdAndDelete.mockResolvedValue({
      _id: "exp123",
      userId: 1000,
      categoryId: 1,
      amount: 45.99,
      description: "Weekly grocery run",
      date: "2026-06-01",
    });

    const response = await request(app).delete("/api/expenses/exp123");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Expense deleted successfully");

    // Confirm the correct ID was passed to the model
    expect(Expense.findByIdAndDelete).toHaveBeenCalledWith("exp123");
  });

  //Verifies that deleting a non-existent expense returns a 404 response.
  test("should return 404 when expense is not found", async () => {
    // Mock no matching document
    Expense.findByIdAndDelete.mockResolvedValue(null);

    const response = await request(app).delete("/api/expenses/doesNotExist");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Expense not found");
  });

  //Verifies that a database failure returns a server error.
  test("should return 500 when an error occurs while deleting expense", async () => {
    // Mock a thrown database error
    Expense.findByIdAndDelete.mockRejectedValue(new Error("Database failure"));

    const response = await request(app).delete("/api/expenses/exp123");

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Server error deleting expense");
  });
});

/**
 * Kaitlyn Kelly
 * Week 8 - Sprint 3
 * Unit tests for the GET category id API.
 */

describe("GET /api/expenses/category/:categoryId", () => {

  // Should return 400 when categoryId is not numeric
  it("should return 400 when categoryId is not numeric", async () => {
    const res = await request(app).get("/api/expenses/category/abc");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("categoryId must be numeric.");
  });

  // Should return 404 when no expenses exist for category
  it("should return 404 when no expenses exist for this category", async () => {
    Expense.find.mockResolvedValue([]); // no expenses found

    const res = await request(app).get("/api/expenses/category/5");

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
            date: "2024-01-01"
          };
        }
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
            date: "2024-01-02"
          };
        }
      }
    ]);

    // Category lookup mocked but not asserted
    Category.findOne.mockResolvedValue({ name: "Travel" });

    const res = await request(app).get("/api/expenses/category/2");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]._id).toBe("exp1");
    expect(res.body[1]._id).toBe("exp2");
  });

});
