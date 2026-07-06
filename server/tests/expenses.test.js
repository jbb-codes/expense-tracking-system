/**
 * Author: Amanda Ruff
 * Date: 7/6/26
 * File: expenses.test.js
 * Description: Unit tests for the Create Expense API.
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
      amount: 25.50,
      description: "Lunch",
      date: "2026-07-06"
    });

    const response = await request(app)
      .post("/api/expenses")
      .send({
        userId: 1000,
        categoryId: 1,
        amount: 25.50,
        description: "Lunch",
        date: "2026-07-06"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.userId).toBe(1000);
  });

  test("should return 400 when required fields are missing", async () => {

    const response = await request(app)
      .post("/api/expenses")
      .send({
        amount: 20
      });

    expect(response.statusCode).toBe(400);
  });

  test("should return 400 when amount is invalid", async () => {

    const response = await request(app)
      .post("/api/expenses")
      .send({
        userId: 1000,
        categoryId: 1,
        amount: -5,
        date: "2026-07-06"
      });

    expect(response.statusCode).toBe(400);
  });

});