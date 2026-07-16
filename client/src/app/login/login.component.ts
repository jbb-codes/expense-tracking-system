/**
 * Author: Kaitlyn Kelly
 * Week 6 - Sprint 1
 * File: login.component.ts
 * Description: Angular component to login to the app, making the other restricted components accessible
 **/

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../expenses/expense.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  template:
  `
  <h1>Welcome!</h1>
  <h2>Please sign in</h2>

  <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
    <label for="username">Username</label>
    <input id="username" type="username" formControlName="username" placeholder="Enter your username">

    <label for="password">Password</label>
    <input id="password" type="password" formControlName="password">

    <button type="submit">Sign In</button>
  </form>
  `,
  styles:
  `
  form {
    margin-top: 1.5rem;
  }
  `
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder, // Builds the reactive form
    private expenseService: ExpenseService, // Calls backend login API
    private authService: AuthService, // Stores authenticated user info
    private router: Router // Navigates to protected routes
  ) {

    // Initialize the login form with validation rules
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


/**
 * Handles login form submission
 * - Validates form input
 * - Calls backend login API
 * - Stores userId and username in AuthService
 * - Redirects to Create an Expense protected route
 * - Displays error message if login fails
 */
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter your username and password';
      return;
    }

    const { username, password } = this.loginForm.value;

    this.expenseService.login(username, password).subscribe({
      next: (res: any) => {
        this.errorMessage = '';

        this.authService.login(res.userId, res.username);

        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
