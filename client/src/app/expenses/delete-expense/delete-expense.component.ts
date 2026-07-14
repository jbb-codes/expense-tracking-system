/**
 * Author: Kaitlyn Kelly
 * Week 7 - Sprint 2
 * File: delete-expense.component.ts
 * Description: Angular component to delete an expense
 **/

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Expense, ExpenseService } from '../expense.service';

@Component({
  selector: 'app-delete-expense',
  standalone: true,
  imports: [CommonModule],
  template: `

    <h1>Delete an Expense</h1>

    @if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
    }

    <!-- List all user expenses -->
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>User ID</th>
          <th>Category ID</th>
          <th>Amount</th>
          <th>Description</th>
          <th>Delete</th>
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
            <td>
              <button class="delete-btn" (click)="deleteItem(expense._id)" aria-label="Delete item">
                <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                </svg>
              </button>
            </td>
          </tr>
        }
      </tbody>
    </table>

  `,
  styles: `
    .delete-btn {
      background-color: transparent;
      border: none;
      color: #f11212;
      cursor: pointer;
    }

    .delete-btn:hover {
      color: #9e0d0d;
    }
  `
})

export class DeleteExpenseComponent implements OnInit {
  expenses: Expense[] = []; // Holds all expenses retrieved from the backend
  errorMessage = '';        // Displays errors for load/delete operations

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    // Load all expenses when the component initializes
    this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses; // Populate table with backend data
        this.errorMessage = '';
      },
      error: () => {
        this.expenses = []; // Clear table on error
        this.errorMessage = 'Error loading expenses.';
      }
    });
  }

  // Deletes an expense by its MongoDB _id and updates the UI without reloading the page
  deleteItem(expenseId: string): void {
    this.expenseService.deleteExpense(expenseId).subscribe({
      next: () => {
        // Remove the deleted expense from the local array so the UI updates immediately
        this.expenses = this.expenses.filter(exp => exp._id !== expenseId);
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Error deleting expense.'; // Display error message on failure
      }
    });
  }
}
