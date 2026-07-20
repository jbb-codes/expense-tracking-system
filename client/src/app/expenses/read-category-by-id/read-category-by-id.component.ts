/**
 * Author: Kaitlyn Kelly
 * Week 8 - Sprint 3
 * File: read-category-by-id.component.ts
 * Description: Angular component to read a category by ID and display related expenses
 *
 * */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../expense.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-read-category-by-id',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Read Category Expenses</h1>

    @if (successMessage) {
      <p class="success-msg">{{ successMessage }}</p>
    }

    @if (errorMessage) {
      <p class="error-msg">{{ errorMessage }}</p>
    }

    <!-- Step 1: Select category -->
    <form [formGroup]="categorySelectForm" (ngSubmit)="onSelectCategory()">
      <label for="categoryId">Select Category</label>
      <select id="categoryId" formControlName="categoryId">
        @for (cat of userCategories; track cat.categoryId) {
          <option [value]="cat.categoryId">
            {{ cat.categoryId }}
          </option>
        }
      </select>

      <button type="submit">Load Category Expenses</button>
    </form>

    <!-- Step 2: Expense list -->
    @if (selectedExpenses.length > 0) {
      <table>
        <thead>
          <tr>
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
              <td>{{ exp.amount | currency:'USD' }}</td>
              <td>{{ exp.description }}</td>
              <td>{{ exp.date | date }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: `
    button {
      margin-bottom: 2rem;
    }
  `
})
export class ReadCategoryByIdComponent implements OnInit {
  successMessage = '';
  errorMessage = '';

  categorySelectForm: FormGroup;

  userExpenses: any[] = [];
  userCategories: any[] = [];
  selectedExpenses: any[] = [];

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private authService: AuthService
  ) {
    this.categorySelectForm = this.fb.group({
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.loadUserCategories(userId);
  }

  loadUserCategories(userId: number): void {
    this.expenseService.getExpenses(userId).subscribe({
      next: (expenses) => {
        this.userExpenses = expenses;

        const categoryMap = new Map();

        expenses.forEach(exp => {
          if (!categoryMap.has(exp.categoryId)) {
            categoryMap.set(exp.categoryId, {
              categoryId: exp.categoryId
            });
          }
        });

        this.userCategories = Array.from(categoryMap.values());
      },
      error: () => {
        this.errorMessage = 'Unable to load categories';
      }
    });
  }

  onSelectCategory(): void {
    if (this.categorySelectForm.invalid) {
      this.errorMessage = 'Please select a category';
      return;
    }

    const categoryId = Number(this.categorySelectForm.value.categoryId);

    this.selectedExpenses = this.userExpenses.filter(
      exp => exp.categoryId === categoryId
    );

    if (this.selectedExpenses.length === 0) {
      this.errorMessage = 'No expenses found for this category';
      this.successMessage = '';
    } else {
      this.errorMessage = '';
      this.successMessage = 'Expenses loaded';
    }
  }
}
