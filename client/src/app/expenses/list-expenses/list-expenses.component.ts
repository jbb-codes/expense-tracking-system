/**
 * Author: Jarren Bess
 * Week 6 - Sprint 1
 * File: list-expenses.component.ts
 * Description: Angular component that lists all expenses.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Expense, ExpenseService } from '../expense.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-list-expenses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Expenses</h1>

    <nav class="page-actions">
      <a routerLink="/create-expense" class="btn">Create Expense</a>
      <a routerLink="/search-expenses" class="btn">Search Expenses</a>
      <a routerLink="/read-expense-by-id" class="btn">Search Expense by ID</a>
    </nav>

    @if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
    }

    <table>
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
            <td>{{ expense.amount | currency: 'USD' : 'symbol' : '1.2-2' }}</td>
            <td>{{ expense.description }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: ``,
})
export class ListExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  errorMessage = '';

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.expenseService.getExpenses(userId).subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.errorMessage = '';
      },
      error: () => {
        this.expenses = [];
        this.errorMessage = 'Error loading expenses.';
      },
    });
  }
}
