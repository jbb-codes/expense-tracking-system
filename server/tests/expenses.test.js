/**
 * Author: Amanda Ruff
 * Date: 7/6/26
 * Modified: Jarren Bess, 7/7/2026
 * File: expenses.test.js
 * Description: Unit tests for the Create and List Expenses API.
 *
 * Changes (Jarren Bess, 7/7/2026):
 * - Added tests for GET / so the new list-all-expenses endpoint has the same
 *   coverage as the existing create endpoint before it ships.
 *
 * Changes (Kaitlyn Kelly, 7/11/2026):
 * - Added tests for ReadExpenseByIdComponent
 */

"use strict";

const request = require("supertest");
const express = require("express");

const expenseRoutes = require("../src/routes/expenses");
const Expense = require("../src/models/Expense");
const Category = require("../src/models/Category");

// Mock the Expense and Category models so tests don't require MongoDB
jest.mock("../src/models/Expense");
jest.mock("../src/models/Category");

const app = express();
app.use(express.json());
app.use("/api/expenses", expenseRoutes);

describe("POST /api/expenses", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should create an expense successfully", async () => {
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

describe("GET /api/expenses", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Confirm the list view has real data to render when expenses exist
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

        const response = await request(app).get("/api/expenses");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].userId).toBe(1000);
    });

    // Guard against a new collection breaking the endpoint before any expenses are created
    test("should return an empty array when no expenses exist", async () => {
        Expense.find.mockResolvedValue([]);

        const response = await request(app).get("/api/expenses");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    // Ensure a database failure surfaces as a clear error instead of an unhandled crash
    test("should return 500 when an error occurs while fetching expenses", async () => {
        Expense.find.mockRejectedValue(new Error("Database error"));

        const response = await request(app).get("/api/expenses");

        expect(response.statusCode).toBe(500);
    });
});

describe("GET /api/expenses/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // 1️⃣ Successful enriched expense fetch
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
            }
        });

        Category.findOne.mockResolvedValue({
            name: "Groceries"
        });

        const response = await request(app).get("/api/expenses/exp123");

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe("exp123");
        expect(response.body.categoryName).toBe("Groceries");
    });

    // 2️⃣ Expense not found
    test("should return 404 when expense is not found", async () => {
        Expense.findById.mockResolvedValue(null);

        const response = await request(app).get("/api/expenses/doesNotExist");

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Expense not found.");
    });

    // 3️⃣ Database error
    test("should return 500 when an error occurs while fetching expense", async () => {
        Expense.findById.mockRejectedValue(new Error("Database failure"));

        const response = await request(app).get("/api/expenses/exp123");

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe("Error fetching expense.");
    });
});


describe("GET /api/expenses/user/:userId", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Valid numeric userId
    test("should return expenses for a valid userId", async () => {
        Expense.find.mockResolvedValue([
            { _id: "1", userId: 1000, categoryId: 1, amount: 20 },
            { _id: "2", userId: 1000, categoryId: 2, amount: 50 }
        ]);

        const response = await request(app).get("/api/expenses/user/1000");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    // Non-numeric userId
    test("should return 400 when userId is not numeric", async () => {
        const response = await request(app).get("/api/expenses/user/notANumber");

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("userId must be numeric.");
    });

    // Database error
    test("should return 500 when an error occurs while fetching user expenses", async () => {
        Expense.find.mockRejectedValue(new Error("DB error"));

        const response = await request(app).get("/api/expenses/user/1000");

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe("Error fetching user expenses");
    });
});
