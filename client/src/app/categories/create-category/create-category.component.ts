/**
 * Author: Amanda Ruff
 * Week 8 - Sprint 3
 * File: create-category.component.ts
 * Description: Angular component used to create a new expense category.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Category,
  CategoryService,
  CreateCategory,
} from '../category.service';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css',
})
export class CreateCategoryComponent {
  /**
   * Amanda Ruff
   * Week 8 - Sprint 3
   *
   * Stores the category information entered into the form.
   */
  category: CreateCategory = {
    userId: 1000,
    categoryId: 0,
    name: '',
    description: '',
  };

  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(private categoryService: CategoryService) {}

  /**
   * Amanda Ruff
   * Week 8 - Sprint 3
   *
   * Validates the category form and sends the information
   * to the Express API when the form is submitted.
   */
  createCategory(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (
      !this.category.userId ||
      !this.category.categoryId ||
      !this.category.name.trim()
    ) {
      this.errorMessage =
        'User ID, category ID, and category name are required.';
      return;
    }

    this.isSubmitting = true;

    this.categoryService.createCategory(this.category).subscribe({
      next: (createdCategory: Category) => {
        this.successMessage =
          `${createdCategory.name} was created successfully.`;
        this.errorMessage = '';
        this.isSubmitting = false;

        // Reset the form after a successful category creation.
        this.category = {
          userId: createdCategory.userId,
          categoryId: 0,
          name: '',
          description: '',
        };
      },
      error: (error) => {
        this.successMessage = '';
        this.errorMessage =
          error.error?.message || 'Unable to create the category.';
        this.isSubmitting = false;
      },
    });
  }
}
