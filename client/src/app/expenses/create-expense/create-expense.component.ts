/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * File: create-expense.component.ts
 * Description: Angular component for the Create Expense form.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExpenseService } from '../expense.service';
import { Category, CategoryService } from '../../categories/category.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-create-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Create Expense</h1>

    @if (successMessage) {
      <p class="success-msg">{{ successMessage }}</p>
    }

    @if (errorMessage) {
      <p class="error-msg">{{ errorMessage }}</p>
    }

    <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()">
      <label for="categoryId">Category</label>
      <select id="categoryId" formControlName="categoryId">
        @for (category of categories; track category.categoryId) {
          <option [ngValue]="category.categoryId">{{ category.name }}</option>
        }
      </select>

      <label for="amount">Amount</label>
      <input id="amount" type="number" formControlName="amount" />

      <label for="description">Description</label>
      <input id="description" type="text" formControlName="description" />

      <label for="date">Date</label>
      <input id="date" type="date" formControlName="date" />

      <button type="submit">Create Expense</button>
    </form>
  `,
  styles: ``,
})
export class CreateExpenseComponent implements OnInit {
  successMessage = '';
  errorMessage = '';
  expenseForm: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private authService: AuthService,
  ) {
    this.expenseForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: [''],
      date: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.categoryService.getCategories(userId).subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: () => {
        this.errorMessage = 'Error loading categories.';
      },
    });
  }

  /**
   * Amanda Ruff
   * Handles form submission for creating a new expense.
   */
  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    const newExpense = {
      userId: this.authService.getUserId(),
      ...this.expenseForm.value,
    };

    this.expenseService.createExpense(newExpense).subscribe({
      next: () => {
        this.successMessage = 'Expense created successfully.';
        this.errorMessage = '';
        this.expenseForm.reset({
          categoryId: null,
          amount: null,
          description: '',
          date: '',
        });
      },
      error: () => {
        this.errorMessage = 'Error creating expense.';
        this.successMessage = '';
      },
    });
  }
}
