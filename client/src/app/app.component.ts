import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `

    <!-- basic nav -->
    <nav>
      <a routerLink="/">Home</a><br>
      <a routerLink="/create-expense">Create Expense</a><br>
      <a routerLink="/style-test">Style Test Page</a>
    </nav>

    <main>
      <p>Main and/or Route Content Here</p>
      <router-outlet></router-outlet>
    </main>

    <footer>
      <p>Footer Content Here</p>
    </footer>
  `,
  styles: ``
})
export class AppComponent {
  title = 'client';
}
