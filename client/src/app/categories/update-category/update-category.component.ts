/**
 * Author: Amanda Ruff
 * Date: 7/27/2026
 * Week 9 - Sprint 4
 * File: update-category.component.ts
 * Description: Angular component used to select, load, edit,
 * and update an existing category.
 *
 * Changes (Amanda Ruff, 7/27/2026):
 * - Added a dropdown for selecting one of the authenticated user's categories.
 * - Added a reactive form for editing the category name and description.
 * - Added validation and success/error messages.
 * - Added support for the Update Category API through CategoryService.
 * - Used an inline template and inline styles to match the team structure.
 */

import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Category, CategoryService, UpdateCategory, } from '../category.service';
import { AuthService } from '../../auth/auth.service';
import { RouterLink } from '@angular/router';

/**
 * Length of time the temporary category-loaded message remains visible.
 */
const SELECT_MESSAGE_DURATION_MS = 3000;

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <h1>Update Category</h1>

    <!--
      Amanda Ruff
      Week 9 - Sprint 4

      Displays an error if the authenticated user's categories
      cannot be loaded from the API.
    -->
    @if (categoryLoadErrorMessage) {
      <p class="error-msg">{{ categoryLoadErrorMessage }}</p>
    }

    <!--
      Amanda Ruff
      Week 9 - Sprint 4

      Allows the user to select an existing category before
      displaying the editable category form.
    -->
    <form
      [formGroup]="categorySelectForm"
      (ngSubmit)="onSelectCategory()"
    >
      <label for="selectedCategoryId">Select Category</label>

      <select
        id="selectedCategoryId"
        formControlName="categoryId"
      >
        <option value="">Choose a category</option>

        @for (
          category of userCategories;
          track category.categoryId
        ) {
          <option [ngValue]="category.categoryId">
            {{ category.name }}
          </option>
        }
      </select>

      <button type="submit">Load Category</button>

      @if (selectMessage) {
        <p class="success-msg">{{ selectMessage }}</p>
      }

      @if (selectErrorMessage) {
        <p class="error-msg">{{ selectErrorMessage }}</p>
      }
    </form>

    <!--
      Amanda Ruff
      Week 9 - Sprint 4

      Displays the editable form only after the user selects
      and loads an existing category.
    -->
    @if (selectedCategoryId !== null) {
      <form
        [formGroup]="categoryForm"
        (ngSubmit)="onSubmit()"
      >
        <label for="categoryId">Category ID</label>

        <!--
          The categoryId is displayed for reference but cannot
          be changed because it identifies the existing record.
        -->
        <input
          id="categoryId"
          type="number"
          [value]="selectedCategoryId"
          disabled
        />

        <label for="name">Category Name</label>
        <input
          id="name"
          type="text"
          formControlName="name"
        />

        <label for="description">Description</label>
        <input
          id="description"
          type="text"
          formControlName="description"
        />

        <button type="submit">Update Category</button>

        @if (successMessage) {
          <p class="success-msg">{{ successMessage }}</p>
        }

        @if (errorMessage) {
          <p class="error-msg">{{ errorMessage }}</p>
        }
      </form>

      <a routerLink="/list-categories" class="btn">&#8592; Back</a>
    }
  `,
  styles: `
    form {
      margin-bottom: 2rem;
    }

    label {
      display: block;
      margin-top: 1rem;
    }

    input,
    select {
      display: block;
      margin-top: 0.25rem;
    }

    button {
      margin-top: 1rem;
    }
  `,
})
export class UpdateCategoryComponent
  implements OnInit, OnDestroy
{
  /**
   * Categories belonging to the currently authenticated user.
   */
  userCategories: Category[] = [];

  /**
   * Numeric ID of the category currently loaded for editing.
   *
   * A null value means the user has not loaded a category yet.
   */
  selectedCategoryId: number | null = null;

  /**
   * Messages displayed while loading or updating categories.
   */
  successMessage = '';
  errorMessage = '';
  selectMessage = '';
  selectErrorMessage = '';
  categoryLoadErrorMessage = '';

  /**
   * Form used to select the category that will be updated.
   */
  categorySelectForm: FormGroup;

  /**
   * Form containing the editable category fields.
   */
  categoryForm: FormGroup;

  /**
   * Stores the temporary message timer so it can be cleared
   * when the component is destroyed or a new message is shown.
   */
  private selectMessageTimeoutId?:
    ReturnType<typeof setTimeout>;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private authService: AuthService,
  ) {
    /**
     * Amanda Ruff
     * Week 9 - Sprint 4
     *
     * Creates the reactive form used to select a category.
     */
    this.categorySelectForm = this.fb.group({
      categoryId: ['', Validators.required],
    });

    /**
     * Amanda Ruff
     * Week 9 - Sprint 4
     *
     * Creates the reactive form containing the category fields
     * that may be edited by the user.
     */
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  /**
   * Amanda Ruff
   * Week 9 - Sprint 4
   *
   * Loads the authenticated user's categories when the
   * component is initialized.
   */
  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.loadCategories(userId);
  }

  /**
   * Amanda Ruff
   * Week 9 - Sprint 4
   *
   * Clears the temporary message timer when the component
   * is removed from the page.
   */
  ngOnDestroy(): void {
    clearTimeout(this.selectMessageTimeoutId);
  }

  /**
   * Amanda Ruff
   * Week 9 - Sprint 4
   *
   * Retrieves all categories belonging to the authenticated user.
   * These categories are displayed in the selection dropdown.
   *
   * @param userId Numeric ID of the authenticated user.
   */
  loadCategories(userId: number): void {
    this.categoryService.getCategories(userId).subscribe({
      next: (categories: Category[]) => {
        // Store the returned categories for the dropdown.
        this.userCategories = categories;

        // Clear any previous category-loading error.
        this.categoryLoadErrorMessage = '';
      },
      error: () => {
        // Clear the category list if the request fails.
        this.userCategories = [];

        // Display a user-friendly loading error.
        this.categoryLoadErrorMessage =
          'Unable to load categories.';
      },
    });
  }

  /**
   * Amanda Ruff
   * Week 9 - Sprint 4
   *
   * Finds the selected category in the user's loaded category
   * list and fills the edit form with its current values.
   */
  onSelectCategory(): void {
    // Clear messages left over from a previous selection.
    this.selectErrorMessage = '';
    this.successMessage = '';
    this.errorMessage = '';

    // Stop the request when the user has not selected a category.
    if (this.categorySelectForm.invalid) {
      clearTimeout(this.selectMessageTimeoutId);

      this.selectErrorMessage =
        'Please select a category.';
      this.selectMessage = '';
      return;
    }

    // Convert the selected categoryId to a number.
    const categoryId = Number(
      this.categorySelectForm.value.categoryId,
    );

    /**
     * Find the full category record from the categories
     * already loaded for the authenticated user.
     */
    const selectedCategory = this.userCategories.find(
      (category) => category.categoryId === categoryId,
    );

    // Stop if the selected category cannot be found.
    if (!selectedCategory) {
      clearTimeout(this.selectMessageTimeoutId);

      this.selectedCategoryId = null;
      this.selectErrorMessage =
        'Unable to load the selected category.';
      this.selectMessage = '';
      return;
    }

    // Store the categoryId used by the Update Category API.
    this.selectedCategoryId =
      selectedCategory.categoryId;

    /**
     * Fill the editable form with the category's existing
     * name and description.
     */
    this.categoryForm.patchValue({
      name: selectedCategory.name,
      description:
        selectedCategory.description || '',
    });

    // Display a temporary success message.
    this.showSelectMessage(
      'Category loaded successfully.',
    );
  }

  /**
   * Amanda Ruff
   * Week 9 - Sprint 4
   *
   * Displays a temporary message after a category is loaded.
   *
   * @param message Message displayed to the user.
   */
  private showSelectMessage(message: string): void {
    // Clear an existing timer before starting another one.
    clearTimeout(this.selectMessageTimeoutId);

    this.selectMessage = message;
    this.selectErrorMessage = '';

    // Remove the message after the configured duration.
    this.selectMessageTimeoutId = setTimeout(() => {
      this.selectMessage = '';
    }, SELECT_MESSAGE_DURATION_MS);
  }

  /**
   * Amanda Ruff
   * Week 9 - Sprint 4
   *
   * Validates the edit form and sends the updated category
   * information to the Update Category API.
   */
  onSubmit(): void {
    // Clear messages from a previous update attempt.
    this.successMessage = '';
    this.errorMessage = '';

    // Ensure a category has been selected before updating.
    if (this.selectedCategoryId === null) {
      this.errorMessage =
        'Please select a category before updating.';
      return;
    }

    // Stop the request when a required field is invalid.
    if (this.categoryForm.invalid) {
      this.errorMessage =
        'Please complete all required fields.';
      return;
    }

    /**
     * Create the request body using only the editable fields.
     *
     * categoryId and userId are not included because the API
     * uses the route parameter and existing database record.
     */
    const updatedCategory: UpdateCategory = {
      name: this.categoryForm.value.name,
      description:
        this.categoryForm.value.description || '',
    };

    // Send the updated category information to the API.
    this.categoryService
      .updateCategory(
        this.selectedCategoryId,
        updatedCategory,
      )
      .subscribe({
        next: (category: Category) => {
          // Display confirmation using the updated category name.
          this.successMessage =
            `${category.name} was updated successfully.`;
          this.errorMessage = '';

          /**
           * Refresh the category dropdown so it displays the
           * updated name and description.
           */
          const userId =
            this.authService.getUserId();

          this.loadCategories(userId);
        },
        error: (error: HttpErrorResponse) => {
          // Display the API message when one is available.
          this.errorMessage =
            error.error?.message ||
            'Unable to update the category.';

          this.successMessage = '';
        },
      });
  }
}
