import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

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
  title = 'client';
}
