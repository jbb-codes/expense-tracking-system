import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Public landing page shown at the root route.
 * Offers a way for new visitors to sign in or register.
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  template: `
    <h1>Expense Tracking System</h1>

    <div class="landing__card">
      <p class="landing__tagline">
        Track spending, organize it by category, and see where your money goes.
      </p>

      <div class="landing__actions">
        <a routerLink="/login" class="landing__button">Sign In</a>
        <a routerLink="/register" class="landing__button">Register</a>
      </div>
    </div>
  `,
  styles: `
    .landing__card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      margin: 2rem auto 0;
      padding: 2rem;
      max-width: 500px;
      background-color: #f6f3f3;
      border: 1px solid #192a53;
      border-radius: 10px;
    }

    .landing__tagline {
      text-align: center;
      margin: 0;
    }

    .landing__actions {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }

    .landing__button {
      text-align: center;
      text-decoration: none;
      background-color: #b9c9ed;
      cursor: pointer;
      padding: 0.5rem 1.5rem;
      border: 1px solid #192a53;
      border-radius: 10px;
    }

    .landing__button:hover {
      background-color: #798dbd;
    }
  `,
})
export class LandingComponent {}
