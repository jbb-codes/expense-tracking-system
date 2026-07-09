/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * File: create-expense.component.ts
 * Description: Angular component for the Create Expense form.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../expense.service';

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
        <label for="userId">User ID</label>
        <input id="userId" type="number" formControlName="userId">

        <label for="categoryId">Category ID</label>
        <input id="categoryId" type="number" formControlName="categoryId">

        <label for="amount">Amount</label>
        <input id="amount" type="number" formControlName="amount">

        <label for="description">Description</label>
        <input id="description" type="text" formControlName="description">

        <label for="date">Date</label>
        <input id="date" type="date" formControlName="date">

        <button type="submit">Create Expense</button>
      </form>
    `,
  styles: ``,
})

export class CreateExpenseComponent {
  successMessage = '';
  errorMessage = '';
  expenseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService
  ) {
    this.expenseForm = this.fb.group({
      userId: [1000, [Validators.required]],
      categoryId: [1, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: [''],
      date: ['', [Validators.required]]
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

    this.expenseService.createExpense(this.expenseForm.value).subscribe({
      next: () => {
        this.successMessage = 'Expense created successfully.';
        this.errorMessage = '';
        this.expenseForm.reset({
          userId: 1000,
          categoryId: 1,
          amount: null,
          description: '',
          date: ''
        });
      },
      error: () => {
        this.errorMessage = 'Error creating expense.';
        this.successMessage = '';
      }
    });
  }
}
