/**
 * File: app.component.ts
 * Description: Root application component containing the main navigation,
 * router outlet, logout behavior, and footer.
 *
 * Changes (Amanda Ruff, 7/20/2026):
 * - Added Create Category to the main navigation.
 * - Added List Categories to the main navigation for consistency.
 * - Grouped expense and category links in a logical order.
 */

import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="layout">
      @if (!isNavOpen) {
        <button
          type="button"
          class="nav-toggle-button nav-toggle-button--fixed"
          data-testid="nav-open-button"
          aria-label="Open navigation menu"
          aria-controls="main-nav"
          (click)="toggleNav()"
        >
          <span
            class="nav-toggle-button__icon nav-toggle-button__icon--open"
          ></span>
        </button>
      }

      <nav id="main-nav" data-testid="main-nav" [class.nav--open]="isNavOpen">
        @if (isNavOpen) {
          <button
            type="button"
            class="nav-toggle-button"
            data-testid="nav-close-button"
            aria-label="Close navigation menu"
            aria-controls="main-nav"
            (click)="toggleNav()"
          >
            <span
              class="nav-toggle-button__icon nav-toggle-button__icon--close"
            ></span>
          </button>

          <a routerLink="/home">Home</a>

          <a routerLink="/create-expense">Create Expense</a>
          <a routerLink="/list-expenses">List Expenses</a>
          <a routerLink="/read-expense-by-id">Read Expense by ID</a>

          <!--
            Amanda Ruff
            Week 7 - Sprint 2
            Added navigation to the Update Expense page.
          -->
          <a routerLink="/update-expense">Update Expense</a>

          <a routerLink="/search-expenses">Search Expenses</a>
          <a routerLink="/delete-expense">Delete Expense</a>

          <!--
            Amanda Ruff
            Week 8 - Sprint 3
            Added navigation to the Create Category page.
          -->
          <a routerLink="/create-category">Create Category</a>

          <a routerLink="/list-categories">List Categories</a>
          <a routerLink="/read-category-by-id"> Read Category by ID </a>

          <div class="nav-button-wrapper">
            <button type="submit" (click)="logout()">Logout</button>
          </div>
        }
      </nav>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>

    <footer>
      <p>&copy; 2026 Bellevue University</p>
      <p>Created by: Jarren Bess, Kaitlyn Kelly, & Amanda Ruff</p>
    </footer>
  `,
  styles: ``,
})
export class AppComponent {
  isNavOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /**
   * Opens or closes the main navigation menu.
   */
  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
  }

  /**
   * Logs out the current user, closes the navigation menu,
   * and returns the user to the login page.
   */
  logout(): void {
    this.authService.logout();
    this.isNavOpen = false;
    this.router.navigate(['/login']);
  }
}
