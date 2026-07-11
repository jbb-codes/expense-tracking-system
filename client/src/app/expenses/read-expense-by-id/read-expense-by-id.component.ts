/**
 * Author: Kaitlyn Kelly
 * Week 6 - Sprint 1
 * File: read-expense-by-id.component.ts
 * Description: Angular component to read an expense by ID and display details of the expense
 **/

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Expense, ExpenseService } from '../expense.service';

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

    <!-- STEP 1: Login -->
    <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
      <label for="username">Enter Your Username</label>
      <input id="username" type="username" formControlName="username">

      <label for="password">Enter Your Password</label>
      <input id="password" type="password" formControlName="password">

      <button type="submit">Sign In</button>
    </form>

    <!-- STEP 2: Select expense -->
    @if (isAuthenticated) {
    <form [formGroup]="expenseSelectForm" (ngSubmit)="onSelectExpense()">
      <label for="expenseId">Select Expense</label>
      <select id="expenseId" formControlName="expenseId">
        @for (exp of userExpenses; track exp._id) {
          <option [value]="exp._id">
            {{ exp._id }} – {{ exp.description }}
          </option>
        }
      </select>

      <button type="submit">Load Expense</button>
    </form>
    }

    <!-- Step 3: Expense details -->
    @if (selectedExpense) {
      <table>
        <tr>
          <th>Category Name</th>
          <td>{{ selectedExpense.categoryName }}</td>
        </tr>
        <tr>
          <th>Amount</th>
          <td>{{ selectedExpense.amount }}</td>
        </tr>
        <tr>
          <th>Description</th>
          <td>{{ selectedExpense.description }}</td>
        </tr>
        <tr>
          <th>Date</th>
          <td>{{ selectedExpense.date | date }}</td>
        </tr>
      </table>
    }

    `,
  styles: ``
})

export class ReadExpenseByIdComponent {
  successMessage = '';
  errorMessage = '';
  isAuthenticated = false;

  loginForm: FormGroup;
  expenseSelectForm: FormGroup;

  userExpenses: any[] = [];
  selectedExpense: any | null = null;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.expenseSelectForm = this.fb.group({
      expenseId: ['', Validators.required]
    });
  }

  // STEP 1: Login
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter your user ID and password';
      return;
    }

    const { username, password } = this.loginForm.value as {
      username: string;
      password: string;
    }

    this.expenseService.login(username, password).subscribe({
      next: (res) => {
        this.errorMessage = '';
        this.isAuthenticated = true;

        // Load user expenses
        this.loadUserExpenses(res.userId);
      },
      error: () => {
        this.errorMessage = 'Invalid user ID or password';
        this.successMessage = '';
      }
    });
  }

  // STEP 2: Load expenses for dropdown selection
  loadUserExpenses(userId: number): void {
    this.expenseService.getExpenseByUser(userId).subscribe({
      next: (expenses) => {
        this.userExpenses = expenses;
      },
      error: () => {
        this.errorMessage = 'Unable to load expenses';
      }
    });
  }

  // STEP 3: Select expense
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
      }
    });
  }
}

