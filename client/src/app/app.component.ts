/**
 * File: app.component.ts
 * Description: Root application component. Renders the sidebar + topbar
 * app shell (dashboard nav, welcome greeting, profile menu) around the
 * router outlet for authenticated users, and a bare outlet otherwise
 * (e.g. the login page).
 */

import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      @if (isAuthenticated) {
        <div class="shell" [class.shell--nav-closed]="!isNavOpen">
          <button
            type="button"
            class="shell__toggle"
            aria-label="Toggle navigation menu"
            (click)="toggleNav()"
          >
            <span
              class="shell__toggle-icon"
              [class.shell__toggle-icon--open]="!isNavOpen"
              [class.shell__toggle-icon--close]="isNavOpen"
            ></span>
          </button>

          <nav class="sidebar">
            <a
              routerLink="/home"
              routerLinkActive="sidebar__link--active"
              class="sidebar__link"
            >
              <span class="sidebar__icon">&#8962;</span> Dashboard
            </a>
            <a
              routerLink="/list-expenses"
              routerLinkActive="sidebar__link--active"
              class="sidebar__link"
            >
              <span class="sidebar__icon">&#9776;</span> Expenses
            </a>
            <a
              routerLink="/list-categories"
              routerLinkActive="sidebar__link--active"
              class="sidebar__link"
            >
              <span class="sidebar__icon">&#127991;</span> Categories
            </a>
          </nav>

          <div class="shell__main">
            <div class="topbar">
              <strong class="topbar__brand">Expense Tracking System</strong>
              <div class="topbar__right">
                Welcome, {{ username }}!
                <div class="user-menu">
                  <button
                    type="button"
                    class="user-menu__avatar"
                    aria-label="Open profile menu"
                    (click)="toggleUserMenu()"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                      ></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </button>
                  @if (isUserMenuOpen) {
                    <div class="user-menu__popover">
                      <a class="user-menu__signout" (click)="logout()">
                        Sign Out
                        <svg
                          class="user-menu__signout-icon"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                          ></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                      </a>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div class="shell__content">
              <router-outlet></router-outlet>
            </div>
          </div>
        </div>
      } @else {
        <main>
          <router-outlet></router-outlet>
        </main>
      }
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
  isUserMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get username(): string | null {
    return this.authService.getUsername();
  }

  /**
   * Opens or closes the sidebar.
   */
  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
  }

  /**
   * Opens or closes the profile popover.
   */
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  /**
   * Logs out the current user, closes the profile popover,
   * and returns the user to the login page.
   */
  logout(): void {
    this.authService.logout();
    this.isUserMenuOpen = false;
    this.router.navigate(['/login']);
  }
}
