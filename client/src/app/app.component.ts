import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
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

          <a routerLink="/">Home</a>
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

          <!-- Button not functional yet -->
          <div class="nav-button-wrapper">
            <button type="submit">Logout</button>
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

  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
  }
}
