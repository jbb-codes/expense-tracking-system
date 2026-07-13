/**
 * Jarren Bess
 * Week 7 - Sprint 2
 * File: search-expenses.component.ts
 * Description: Angular component that searches a user's expenses by description.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Expense, ExpenseService } from '../expense.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-search-expenses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Search Expenses</h1>

    <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
      <label for="description">Description</label>
      <input id="description" type="text" formControlName="description" />

      <button type="submit">Search</button>
    </form>

    @if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
    }

    @if (expenses.length) {
      <table class="search-expenses__results">
        <thead>
          <tr>
            <th>Date</th>
            <th>User ID</th>
            <th>Category ID</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          @for (expense of expenses; track expense) {
            <tr>
              <td>{{ expense.date | date }}</td>
              <td>{{ expense.userId }}</td>
              <td>{{ expense.categoryId }}</td>
              <td>{{ expense.amount }}</td>
              <td>{{ expense.description }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: `
    .search-expenses__results {
      margin-top: 2rem;
    }
  `,
})
export class SearchExpensesComponent {
  expenses: Expense[] = [];
  errorMessage = '';
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private authService: AuthService,
  ) {
    this.searchForm = this.fb.group({
      description: [''],
    });
  }

  /**
   * Sends the logged-in user's ID and the entered description to the
   * Search Expenses API and populates the results table.
   */
  onSearch(): void {
    const userId = this.authService.getUserId();
    const { description } = this.searchForm.value;

    this.expenseService.searchExpenses(userId, description).subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.errorMessage = '';
      },
      error: () => {
        this.expenses = [];
        this.errorMessage = 'Error searching expenses.';
      },
    });
  }
}
