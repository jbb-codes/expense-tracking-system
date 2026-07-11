import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `

    <div class="layout">
      <nav>
        <a routerLink="/">Home</a>
        <a routerLink="/create-expense">Create Expense</a>
        <a routerLink="/list-expenses">List Expenses</a>
        <a routerLink="/read-expense-by-id">Read Expense by ID</a>

        <!-- Button not functional yet -->
        <div class="nav-button-wrapper">
          <button type="submit">Logout</button>
        </div>
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
  styles: ``
})
export class AppComponent {

}
