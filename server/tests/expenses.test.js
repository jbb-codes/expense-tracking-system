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
 */

"use strict";

const request = require("supertest");
const express = require("express");

const expenseRoutes = require("../src/routes/expenses");
const Expense = require("../src/models/Expense");

// Mock the Expense model so tests don't require MongoDB
jest.mock("../src/models/Expense");

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
