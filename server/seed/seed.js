/**
 * Author: Jarren Bess
 * Date: 7/6/26
 * File: seed.js
 * Description: Seeds the Users, Categories, and Expenses collections with sample data.
 */

"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../src/utils/db");
const User = require("../src/models/User");
const Category = require("../src/models/Category");
const Expense = require("../src/models/Expense");

const SALT_ROUNDS = 10;

const users = [
  {
    userId: 1000,
    username: "jbess",
    password: "Sample-Password-1",
    email: "jbess@example.com",
  },
  {
    userId: 1001,
    username: "amiller",
    password: "Sample-Password-2",
    email: "amiller@example.com",
  },
  {
    userId: 1002,
    username: "ktran",
    password: "Sample-Password-3",
    email: "ktran@example.com",
  },
];

const categories = [
  {
    userId: 1000,
    categoryId: 1,
    name: "Groceries",
    description: "Everyday food and household items",
  },
  {
    userId: 1000,
    categoryId: 2,
    name: "Utilities",
    description: "Electricity, water, internet",
  },
  {
    userId: 1001,
    categoryId: 3,
    name: "Travel",
    description: "Flights, hotels, transportation",
  },
  {
    userId: 1002,
    categoryId: 4,
    name: "Entertainment",
    description: "Movies, streaming, events",
  },
];

const expenses = [
  {
    userId: 1000,
    categoryId: 1,
    amount: 45.99,
    description: "Weekly grocery run",
    date: new Date("2026-06-01"),
  },
  {
    userId: 1000,
    categoryId: 2,
    amount: 120.5,
    description: "June electric bill",
    date: new Date("2026-06-05"),
  },
  {
    userId: 1001,
    categoryId: 3,
    amount: 350.0,
    description: "Flight to Chicago",
    date: new Date("2026-06-10"),
  },
  {
    userId: 1002,
    categoryId: 4,
    amount: 15.99,
    description: "Streaming subscription",
    date: new Date("2026-06-12"),
  },
];

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Expense.deleteMany({}),
  ]);

  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, SALT_ROUNDS),
    })),
  );

  await User.insertMany(hashedUsers);
  await Category.insertMany(categories);
  await Expense.insertMany(expenses);

  console.log("Seed data inserted: 3 users, 4 categories, 4 expenses");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
