/**
 * Author: Kaitlyn Kelly
 * Week 8 - Sprint 3
 * File: read-category-by-id.component.ts
 * Description: Angular component to read a category by ID and display related expenses
 *
 * */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../category.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-read-category-by-id',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Read Category Expenses</h1>

    @if (errorMessage) {
      <p class="error-msg">{{ errorMessage }}</p>
    }

    <!-- Step 1: Search for a category by ID -->
    <form
      [formGroup]="categorySelectForm"
      (ngSubmit)="onSelectCategory()"
      class="field-row"
    >
      <div class="search-input-wrap">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          id="categoryId"
          type="text"
          formControlName="categoryId"
          list="category-id-options"
          placeholder="Category ID…"
        />
        <datalist id="category-id-options">
          @for (cat of userCategories; track cat.categoryId) {
            <option [value]="cat.categoryId">{{ cat.name }}</option>
          }
        </datalist>
      </div>

      <button type="submit" class="btn">Load</button>
    </form>

    <!-- Step 2: Expense list -->
    @if (selectedExpenses.length > 0) {
      <div class="results">
        <div class="table-scroll">
          <table class="result-table">
            <thead>
              <tr>
                <th>Category ID</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              @for (exp of selectedExpenses; track exp._id) {
                <tr>
                  <td>{{ exp.categoryId }}</td>
                  <td>{{ exp.categoryName }}</td>
                  <td>{{ exp.amount | currency: 'USD' }}</td>
                  <td>{{ exp.description }}</td>
                  <td>{{ exp.date | date }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="results-meta">
          {{ selectedExpenses.length }} result{{
            selectedExpenses.length === 1 ? '' : 's'
          }}
          for category ID "{{ categorySelectForm.value.categoryId }}"
        </p>
      </div>
    }
  `,
  styles: ``,
})
export class ReadCategoryByIdComponent implements OnInit {
  errorMessage = '';

  categorySelectForm: FormGroup;

  userCategories: any[] = [];
  selectedExpenses: any[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private authService: AuthService,
  ) {
    this.categorySelectForm = this.fb.group({
      categoryId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.loadUserCategories(userId);
  }

  loadUserCategories(userId: number): void {
    this.categoryService.getCategories(userId).subscribe({
      next: (categories) => {
        this.userCategories = categories;
      },
      error: () => {
        this.errorMessage = 'Unable to load categories';
      },
    });
  }

  onSelectCategory(): void {
    if (this.categorySelectForm.invalid) {
      this.errorMessage = 'Please select a category';
      return;
    }

    const categoryId = Number(this.categorySelectForm.value.categoryId);

    this.categoryService.getExpensesByCategory(categoryId).subscribe({
      next: (expenses) => {
        if (!expenses || expenses.length === 0) {
          this.selectedExpenses = [];
          this.errorMessage = 'No expenses found for this category';
          this.loadUserCategories(this.authService.getUserId());
          return;
        }

        this.selectedExpenses = expenses;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Backend error:', err);
        this.selectedExpenses = [];
        this.errorMessage =
          err.error?.message || 'No expenses found for this category';
        this.loadUserCategories(this.authService.getUserId());
      },
    });
  }
}
