/**
 * Author: Kaitlyn Kelly
 * Week 6 - Sprint 1
 * File: read-expense-by-id.component.ts
 * Description: Angular component to read an expense by ID and display details of the expense
 **/

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExpenseService } from '../expense.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-read-expense-by-id',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Read Expense</h1>

    @if (successMessage) {
      <p class="success-msg">{{ successMessage }}</p>
    }

    @if (errorMessage) {
      <p class="error-msg">{{ errorMessage }}</p>
    }

    <!-- Step1: Search for an expense by ID -->
    <form
      [formGroup]="expenseSelectForm"
      (ngSubmit)="onSelectExpense()"
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
          id="expenseId"
          type="text"
          formControlName="expenseId"
          list="expense-id-options"
          placeholder="Paste or type expense ID…"
        />
        <datalist id="expense-id-options">
          @for (exp of userExpenses; track exp._id) {
            <option [value]="exp._id">{{ exp.description }}</option>
          }
        </datalist>
      </div>

      <button type="submit" class="btn">Load</button>
    </form>

    <!-- Step 2: Expense details -->
    @if (selectedExpense) {
      <div class="results">
        <div class="table-scroll">
          <table class="result-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ selectedExpense.categoryName }}</td>
                <td>
                  {{
                    selectedExpense.amount
                      | currency: 'USD' : 'symbol' : '1.2-2'
                  }}
                </td>
                <td>{{ selectedExpense.description }}</td>
                <td>{{ selectedExpense.date | date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="results-meta">1 result for ID "{{ selectedExpense._id }}"</p>
      </div>
    }
  `,
  styles: ``,
})
export class ReadExpenseByIdComponent {
  successMessage = '';
  errorMessage = '';
  expenseSelectForm: FormGroup;

  userExpenses: any[] = [];
  selectedExpense: any | null = null;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private authService: AuthService,
  ) {
    this.expenseSelectForm = this.fb.group({
      expenseId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.loadUserExpenses(userId);
  }

  // STEP 1: Load expenses for dropdown selection
  loadUserExpenses(userId: number): void {
    this.expenseService.getExpenses(userId).subscribe({
      next: (expenses) => {
        this.userExpenses = expenses;
      },
      error: () => {
        this.errorMessage = 'Unable to load expenses';
      },
    });
  }

  // STEP 2: Select expense
  onSelectExpense(): void {
    if (this.expenseSelectForm.invalid) {
      this.errorMessage = 'Please select an expense';
      return;
    }

    const expenseId = this.expenseSelectForm.value.expenseId;

    this.expenseService.getExpenseById(expenseId).subscribe({
      next: (expense) => {
        this.selectedExpense = expense;
        this.successMessage = '';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Unable to load expense details';
      },
    });
  }
}
