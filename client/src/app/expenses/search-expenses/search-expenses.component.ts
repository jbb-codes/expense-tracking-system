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

    <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="field-row">
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
          id="description"
          type="text"
          formControlName="description"
          placeholder="Search by description…"
        />
      </div>

      <button type="submit" class="btn">Search</button>
    </form>

    @if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
    }

    @if (expenses.length) {
      <div class="panel">
        <div class="table-scroll">
          <table class="result-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User ID</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              @for (expense of expenses; track expense) {
                <tr>
                  <td>{{ expense.date | date }}</td>
                  <td>{{ expense.userId }}</td>
                  <td>{{ expense.categoryName }}</td>
                  <td>
                    {{ expense.amount | currency: 'USD' : 'symbol' : '1.2-2' }}
                  </td>
                  <td>{{ expense.description }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="results-meta">
          {{ expenses.length }} result{{ expenses.length === 1 ? '' : 's' }} for
          "{{ lastSearchTerm }}"
        </p>
      </div>
    } @else if (hasSearched) {
      <div class="empty-state">
        No expenses found for "{{ lastSearchTerm }}".
      </div>
    }
  `,
  styles: ``,
})
export class SearchExpensesComponent {
  expenses: Expense[] = [];
  errorMessage = '';
  hasSearched = false;
  lastSearchTerm = '';
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
        this.hasSearched = true;
        this.lastSearchTerm = description;
      },
      error: () => {
        this.expenses = [];
        this.errorMessage = 'Error searching expenses.';
        this.hasSearched = true;
        this.lastSearchTerm = description;
      },
    });
  }
}
