import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  template: `
    <div class="landing-card">
      <h1>Expense Tracking System</h1>
      <p>
        Track spending, organize it by category, and see where your money goes.
      </p>
      <div class="landing-actions">
        <button type="button" (click)="onSignIn()">Sign In</button>
        <button type="button" (click)="onRegister()">Register</button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .landing-card {
      background-color: #f6f3f3;
      border: 1px solid #192a53;
      border-radius: 10px;
      padding: 2rem;
      max-width: 400px;
      width: 100%;
      text-align: center;
    }

    .landing-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 2rem;
    }

    .landing-actions button {
      background-color: #b9c9ed;
      cursor: pointer;
      padding: 0.3rem 0.8rem;
      border: 1px solid #192a53;
      border-radius: 10px;
    }

    .landing-actions button:hover {
      background-color: #798dbd;
    }
  `,
})
export class LandingComponent {
  constructor(private router: Router) {}

  onSignIn(): void {
    this.router.navigate(['/login']);
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }
}
