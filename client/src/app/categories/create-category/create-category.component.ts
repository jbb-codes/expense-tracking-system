/**
 * Author: Amanda Ruff
 * Week 8 - Sprint 3
 * File: create-category.component.ts
 * Description: Angular component for the Create Category form.
 *
 * Changes (Amanda Ruff, 7/20/2026):
 * - Converted the component to use an inline template and inline styles.
 * - Updated the form structure to match the Create Expense component.
 * - Added authenticated user ID handling through AuthService.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category, CategoryService } from '../category.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Create Category</h1>

    @if (successMessage) {
      <p class="success-msg">{{ successMessage }}</p>
    }

    @if (errorMessage) {
      <p class="error-msg">{{ errorMessage }}</p>
    }

    <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
      <label for="categoryId">Category ID</label>
      <input id="categoryId" type="number" formControlName="categoryId" />

      <label for="name">Category Name</label>
      <input id="name" type="text" formControlName="name" />

      <label for="description">Description</label>
      <input id="description" type="text" formControlName="description" />

      <button type="submit">Create Category</button>
    </form>
  `,
  styles: ``,
})
export class CreateCategoryComponent {
  successMessage = '';
  errorMessage = '';
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private authService: AuthService,
  ) {
    /**
     * Amanda Ruff
     * Week 8 - Sprint 3
     * Creates the reactive form used to collect category information.
     */
    this.categoryForm = this.fb.group({
      categoryId: [null, [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  /**
   * Amanda Ruff
   * Week 8 - Sprint 3
   * Validates and submits the Create Category form.
   */
  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.categoryForm.invalid) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    const newCategory = {
      userId: this.authService.getUserId(),
      ...this.categoryForm.value,
    };

    this.categoryService.createCategory(newCategory).subscribe({
      next: (createdCategory: Category) => {
        this.successMessage = `${createdCategory.name} was created successfully.`;
        this.errorMessage = '';

        this.categoryForm.reset({
          categoryId: null,
          name: '',
          description: '',
        });
      },
      error: (error) => {
        this.successMessage = '';
        this.errorMessage = error.error?.message || 'Error creating category.';
      },
    });
  }
}
