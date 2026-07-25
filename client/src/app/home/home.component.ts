import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Expense, ExpenseService } from '../expenses/expense.service';
import { computeDashboardStats, sortByDateDescending } from './dashboard-stats';

const RECENT_EXPENSES_LIMIT = 5;

/**
 * Dashboard landing page: summary stat cards, recent expenses, and quick
 * actions. Replaces the old link-grid HomeComponent.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <h1>Welcome, {{ username }}</h1>

      @if (errorMessage) {
        <p class="error-msg">{{ errorMessage }}</p>
      }

      <div>
        <h2>Summary</h2>
        <div class="summary-grid">
          <div class="stat-card">
            <div class="stat-card__label">Total Expenses This Month</div>
            <div class="stat-card__value">
              {{ totalThisMonth | currency: 'USD' : 'symbol' : '1.2-2' }}
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-card__label">Expenses This Week</div>
            <div class="stat-card__value">
              {{ totalThisWeek | currency: 'USD' : 'symbol' : '1.2-2' }}
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-card__label">Expenses Today</div>
            <div class="stat-card__value">
              {{ totalToday | currency: 'USD' : 'symbol' : '1.2-2' }}
            </div>
          </div>
        </div>
      </div>

      <div class="lower-grid">
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
                @for (expense of recentExpenses; track expense._id) {
                  <tr>
                    <td>{{ expense.date | date }}</td>
                    <td>{{ expense.description }}</td>
                    <td>{{ expense.categoryName }}</td>
                    <td>
                      {{
                        expense.amount | currency: 'USD' : 'symbol' : '1.2-2'
                      }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <a routerLink="/list-expenses" class="view-all">View All Expenses</a>
        </div>
        <div class="panel">
          <h2>Quick Actions</h2>
          <div class="quick-actions">
            <a routerLink="/create-expense" class="btn">+ Add Expense</a>
            <a routerLink="/create-category" class="btn btn--success"
              >+ Add Category</a
            >
            <a routerLink="/update-expense" class="btn btn--secondary"
              >Update Expense</a
            >
            <a routerLink="/delete-expense" class="btn btn--danger"
              >Delete Expense</a
            >
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class HomeComponent implements OnInit {
  username: string | null = null;
  errorMessage = '';
  totalThisMonth = 0;
  totalThisWeek = 0;
  totalToday = 0;
  recentExpenses: Expense[] = [];

  /**
   * Snapshot of "now" used for the summary date math. Kept as an
   * overridable field rather than reading Date.now() inline so tests can
   * pin it and assert deterministic totals.
   */
  now: Date = new Date();

  constructor(
    private authService: AuthService,
    private expenseService: ExpenseService,
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();

    const userId = this.authService.getUserId();
    this.expenseService.getExpenses(userId).subscribe({
      next: (expenses) => {
        const stats = computeDashboardStats(expenses, this.now);
        this.totalThisMonth = stats.totalThisMonth;
        this.totalThisWeek = stats.totalThisWeek;
        this.totalToday = stats.totalToday;
        this.recentExpenses = sortByDateDescending(expenses).slice(
          0,
          RECENT_EXPENSES_LIMIT,
        );
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Error loading dashboard data.';
      },
    });
  }
}
