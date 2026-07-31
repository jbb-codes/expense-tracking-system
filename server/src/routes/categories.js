/**
 * Author: Jarren Bess
 * Week 8 - Sprint 3
 * File: categories.js
 * Description: API routes for managing categories.
 *
 * Changes (Amanda Ruff, 7/20/2026):
 * - Fixed formatting and syntax issues after merging.
 * - Added the Create Category API endpoint.
 * - Added validation for required fields.
 * - Added duplicate category validation.
 * - Added appropriate HTTP status codes and error handling.
 *
 * Changes (Kaitlyn Kelly, 7/20/2026):
 * - Added GET /category/:categoryId to support reading a category by ID.
 *
 * Changes (Kaitlyn Kelly, 7/24/2026):
 * - Added GET to support fetching a count of all expenses within a category.
 * - Used to confirm or deny deletion of a category.
 *
 * Changes (Amanda Ruff, 7/27/2026):
 * - Added the Update Category API endpoint for Sprint 4.
 * - Added validation for categoryId and category name.
 * - Added duplicate category name protection.
 * - Added 400, 404, 409, and 500 error responses.
 */

"use strict";

const express = require("express");
const Category = require("../models/Category");
const Expense = require("../models/Expense");
const router = express.Router();

/**
 * Jarren Bess
 * Week 8 - Sprint 3
 *
 * GET /?userId=
 *
 * Retrieves all category records belonging to the given userId.
 * userId is required; missing or non-numeric values return 400.
 *
 * Example:
 * fetch("/api/categories?userId=1000")
 *   .then((response) => response.json())
 *   .then((data) => console.log(data));
 */
router.get("/", async (req, res) => {
  try {
    // Convert the userId query parameter to a number.
    const userId = Number(req.query.userId);

    // Validate that userId contains a numeric value.
    if (isNaN(userId)) {
      return res.status(400).json({
        message: "userId must be numeric.",
      });
    }

    // Retrieve all categories belonging to the selected user.
    const categories = await Category.find({ userId }).sort({
      categoryId: 1,
    });

    // Return the matching category records.
    return res.status(200).json(categories);
  } catch (err) {
    // Log the complete error for server-side troubleshooting.
    console.error("Error fetching categories:", err);

    // Return a general server error response.
    return res.status(500).json({
      message: "Error fetching categories.",
    });
  }
});

/**
 * Amanda Ruff
 * Week 8 - Sprint 3
 *
 * POST /
 *
 * Creates a new category for a user.
 * Validates all required fields before saving the category.
 */
router.post("/", async (req, res) => {
  try {
    // Retrieve the category values from the request body.
    const { userId, categoryId, name, description } = req.body;

    // Validate all required category fields.
    if (
      userId === undefined ||
      categoryId === undefined ||
      !name ||
      name.trim() === ""
    ) {
      return res.status(400).json({
        message: "userId, categoryId, and name are required.",
      });
    }

    // Validate that userId and categoryId contain numeric values.
    if (isNaN(Number(userId)) || isNaN(Number(categoryId))) {
      return res.status(400).json({
        message: "userId and categoryId must be numeric.",
      });
    }

    // Check whether this user already has a category with the same name.
    const existingCategory = await Category.findOne({
      userId: Number(userId),
      name: name.trim(),
    });

    // Prevent duplicate category names for the same user.
    if (existingCategory) {
      return res.status(409).json({
        message: "Category name already exists.",
      });
    }

    // Create a new category document.
    const category = new Category({
      userId: Number(userId),
      categoryId: Number(categoryId),
      name: name.trim(),
      description: description ? description.trim() : "",
    });

    // Save the category to MongoDB.
    const savedCategory = await category.save();

    // Return the newly created category.
    return res.status(201).json(savedCategory);
  } catch (err) {
    // Log the complete error for server-side troubleshooting.
    console.error("Error creating category:", err);

    // Return a general server error response.
    return res.status(500).json({
      message: "Error creating category.",
    });
  }
});

/**
 * Amanda Ruff
 * Week 9 - Sprint 4
 *
 * PUT /:categoryId
 *
 * Updates an existing category using its numeric categoryId.
 * The category name is required, and the route prevents a user
 * from having two categories with the same name.
 *
 * Mongoose automatically updates dateModified because the
 * Category schema has timestamps enabled.
 */
router.put("/:categoryId", async (req, res) => {
  try {
    // Convert the categoryId route parameter to a number.
    const categoryId = Number(req.params.categoryId);

    // Retrieve the editable category fields from the request body.
    const { name, description } = req.body;

    // Validate that categoryId is a positive whole number.
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        message: "categoryId must be a positive integer.",
      });
    }

    // Validate that a category name was provided.
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Category name is required.",
      });
    }

    // Find the category before attempting to update it.
    const category = await Category.findOne({ categoryId });

    // Return 404 when no category matches the supplied categoryId.
    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    // Check whether another category belonging to the same user
    // already has the requested category name.
    const duplicateCategory = await Category.findOne({
      userId: category.userId,
      name: name.trim(),
      categoryId: { $ne: categoryId },
    });

    // Prevent duplicate category names for the same user.
    if (duplicateCategory) {
      return res.status(409).json({
        message: "Category name already exists.",
      });
    }

    // Update the editable category fields.
    category.name = name.trim();
    category.description = description ? description.trim() : "";

    // Save the updated category.
    // Mongoose timestamps automatically update dateModified.
    const updatedCategory = await category.save();

    // Return the updated category document.
    return res.status(200).json(updatedCategory);
  } catch (err) {
    // Log the complete error for server-side troubleshooting.
    console.error("Error updating category:", err);

    // Return a general server error response.
    return res.status(500).json({
      message: "Error updating category.",
    });
  }
});

/**
 * Jarren Bess
 *
 * GET /user/:userId/search
 *
 * Searches categories belonging to a user by matching the search term
 * against the category name or description (case-insensitive).
 * userId is required; missing or non-numeric values return 400.
 */
router.get("/user/:userId/search", async (req, res) => {
  try {
    // Convert the userId route parameter to a number.
    const userId = Number(req.params.userId);

    // Validate that userId contains a numeric value.
    if (isNaN(userId)) {
      return res.status(400).json({
        message: "userId must be numeric.",
      });
    }

    // Retrieve the search term from the query string.
    const { name } = req.query;

    // Find categories belonging to this user whose name
    // matches the search term.
    const categories = await Category.find({
      userId,
      name: { $regex: name || "", $options: "i" },
    });

    // Return the matching category records.
    return res.status(200).json(categories);
  } catch (err) {
    // Log the complete error for server-side troubleshooting.
    console.error("Error searching categories:", err);

    // Return a general server error response.
    return res.status(500).json({
      message: "Error searching categories.",
    });
  }
});

/**
 * Kaitlyn Kelly
 * Week 9 - Sprint 4
 *
 * GET /:id/expenseCount
 *
 * Retrieves the number of expenses assigned to a specific category.
 * This count is used to determine whether the category may be deleted.
 */
router.get("/:id/expenseCount", async (req, res) => {
  try {
    const categoryId = Number(req.params.id);
    const userId = Number(req.query.userId);

    if (isNaN(categoryId) || isNaN(userId)) {
      return res.status(400).json({ error: "categoryId must be numeric" });
    }

    const category = await Category.findOne({ userId, categoryId });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const count = await Expense.countDocuments({ userId, categoryId });

    return res.status(200).json({ count });
  } catch (err) {
    console.error("Error counting expenses:", err);
    return res.status(500).json({ error: "Error counting expenses" });
  }
});


/**
 * Kaitlyn Kelly
 * Week 8 - Sprint 3
 *
 * GET /category/:categoryId
 *
 * Retrieves all expenses assigned to a specific categoryId.
 */
router.get("/category/:categoryId", async (req, res) => {
  try {
    const categoryId = Number(req.params.categoryId);
    const userId = req.query.userId ? Number(req.query.userId) : null;

    if (isNaN(categoryId)) {
      return res.status(400).json({
        message: "categoryId must be numeric.",
      });
    }

    let category;

    if (userId !== null) {
      if (isNaN(userId)) {
        return res.status(400).json({
          message: "userId must be numeric.",
        });
      }

      category = await Category.findOne({ userId, categoryId });
    } else {
      category = await Category.findOne({ categoryId });
    }

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    const effectiveUserId = userId !== null ? userId : category.userId;

    const expenses = await Expense.find({
      userId: effectiveUserId,
      categoryId,
    });

    if (!expenses || expenses.length === 0) {
      return res.status(404).json({
        message: "No expenses found for this category.",
      });
    }

    const enrichedExpenses = expenses.map((expense) => ({
      ...expense.toObject(),
      categoryName: category.name,
    }));

    return res.status(200).json(enrichedExpenses);
  } catch (err) {
    console.error("Error fetching expenses by category:", err);
    return res.status(500).json({
      message: "Error fetching expenses by category.",
      error: err.message,
    });
  }
});




/**
 * Kaitlyn Kelly
 * Week 9 - Sprint 4
 *
 * DELETE /:categoryId
 *
 * Deletes a category using its numeric categoryId.
 */
router.delete("/:categoryId", async (req, res) => {
  try {
    const categoryId = Number(req.params.categoryId);
    const userId = Number(req.query.userId);

    // Validate that categoryId is a positive whole number.
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        error: "Invalid categoryId",
      });
    }

    // Delete the category matching the supplied categoryId for the specific user
    const deleted = await Category.deleteOne({ userId, categoryId });

    // Return 404 when no category was deleted.
    if (deleted.deletedCount === 0) {
      return res.status(404).json({
        error: "Category not found",
      });
    }

    // Confirm that the category was deleted.
    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (err) {
    // Log the complete error for server-side troubleshooting.
    console.error("Error deleting category:", err);

    // Return a general server error response.
    return res.status(500).json({
      error: "Error deleting category",
    });
  }
});

module.exports = router;
