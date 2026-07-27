/**
 * Author: Project Team
 * File: home.component.ts
 * Description: Dashboard landing page containing expense summaries,
 * recent expenses, and quick-action navigation links.
 *
 * Changes (Amanda Ruff, 7/27/2026):
 * - Added an Update Category quick-action link for Sprint 4.
 * - Added comments describing the new navigation option.
 * - Corrected spacing and formatting inconsistencies.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {
  Expense,
  ExpenseService,
} from '../expenses/expense.service';
import {
  computeDashboardStats,
  sortByDateDescending,
} from './dashboard-stats';

/**
 * Maximum number of recent expenses displayed on the dashboard.
 */
const RECENT_EXPENSES_LIMIT = 5;

/**
 * Dashboard landing page containing summary cards,
 * recent expenses, and quick navigation actions.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  template: `
    <div class="dashboard">
      <h1>Welcome, {{ username }}</h1>

      @if (errorMessage) {
        <p class="error-msg">{{ errorMessage }}</p>
      }

      <!--
        Displays summary totals calculated from the
        authenticated user's expense records.
      -->
      <div>
        <h2>Summary</h2>

        <div class="summary-grid">
          <div class="stat-card">
            <div class="stat-card__label">
              Total Expenses This Month
            </div>

            <div class="stat-card__value">
              {{
                totalThisMonth
                  | currency: 'USD' : 'symbol' : '1.2-2'
              }}
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card__label">
              Expenses This Week
            </div>

            <div class="stat-card__value">
              {{
                totalThisWeek
                  | currency: 'USD' : 'symbol' : '1.2-2'
              }}
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card__label">
              Expenses Today
            </div>

            <div class="stat-card__value">
              {{
                totalToday
                  | currency: 'USD' : 'symbol' : '1.2-2'
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="lower-grid">
        <!--
          Displays the five most recent expenses belonging
          to the authenticated user.
        -->
        <div class="panel">
          <h2>Recent Expenses</h2>

          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                @for (
                  expense of recentExpenses;
                  track expense._id
                ) {
                  <tr>
                    <td>{{ expense.date | date }}</td>
                    <td>{{ expense.description }}</td>
                    <td>{{ expense.categoryName }}</td>
                    <td>
                      {{
                        expense.amount
                          | currency: 'USD' : 'symbol' : '1.2-2'
                      }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <a
            routerLink="/list-expenses"
            class="view-all"
          >
            View All Expenses
          </a>
        </div>

        <!--
          Provides shortcuts to commonly used expense
          and category features.
        -->
        <div class="panel">
          <h2>Quick Actions</h2>

          <div class="quick-actions">
            <a
              routerLink="/create-expense"
              class="btn"
            >
              + Add Expense
            </a>

            <a
              routerLink="/create-category"
              class="btn btn--success"
            >
              + Add Category
            </a>

            <a
              routerLink="/update-expense"
              class="btn btn--secondary"
            >
              Update Expense
            </a>

            <a
              routerLink="/delete-expense"
              class="btn btn--danger"
            >
              Delete Expense
            </a>

            <!--
              Amanda Ruff
              Week 9 - Sprint 4

              Opens the page used to select and update
              an existing category.
            -->
            <a
              routerLink="/update-category"
              class="btn btn--secondary"
            >
              Update Category
            </a>

            <a
              routerLink="/delete-category"
              class="btn btn--danger"
            >
              Delete Category
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class HomeComponent implements OnInit {
  /**
   * Username displayed in the dashboard greeting.
   */
  username: string | null = null;

  /**
   * Error shown if dashboard expense data cannot be loaded.
   */
  errorMessage = '';

  /**
   * Calculated expense totals displayed in the summary cards.
   */
  totalThisMonth = 0;
  totalThisWeek = 0;
  totalToday = 0;

  /**
   * Most recent expenses displayed in the dashboard table.
   */
  recentExpenses: Expense[] = [];

  /**
   * Snapshot of the current date used for summary calculations.
   *
   * Keeping this as a property allows unit tests to replace
   * it with a predictable date.
   */
  now: Date = new Date();

  constructor(
    private authService: AuthService,
    private expenseService: ExpenseService,
  ) {}

  /**
   * Loads the authenticated user's name and dashboard
   * expense data when the component initializes.
   */
  ngOnInit(): void {
    // Retrieve the username used in the welcome message.
    this.username = this.authService.getUsername();

    // Retrieve the authenticated user's numeric ID.
    const userId = this.authService.getUserId();

    // Load expenses used to calculate dashboard values.
    this.expenseService.getExpenses(userId).subscribe({
      next: (expenses: Expense[]) => {
        /**
         * Calculate the monthly, weekly, and daily totals
         * from the returned expense records.
         */
        const stats = computeDashboardStats(
          expenses,
          this.now,
        );

        this.totalThisMonth =
          stats.totalThisMonth;
        this.totalThisWeek =
          stats.totalThisWeek;
        this.totalToday =
          stats.totalToday;

        /**
         * Sort expenses from newest to oldest and retain
         * only the number displayed on the dashboard.
         */
        this.recentExpenses =
          sortByDateDescending(expenses).slice(
            0,
            RECENT_EXPENSES_LIMIT,
          );

        // Clear any previous dashboard error.
        this.errorMessage = '';
      },
      error: () => {
        // Display a user-friendly message if loading fails.
        this.errorMessage =
          'Error loading dashboard data.';
      },
    });
  }
}
