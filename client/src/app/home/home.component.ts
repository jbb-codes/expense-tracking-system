import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Update to display username -->
    <h1>Welcome, {{ username }}</h1>

    <h2>What would you like to do today?</h2>

    <div class="home-link-wrapper">
      <a routerLink="/create-expense" class="home-link">Create Expense</a>
      <a routerLink="/list-expenses" class="home-link">List Expenses</a>
      <a routerLink="/read-expense-by-id" class="home-link"
        >Read Expense by ID</a
      >
      <a routerLink="/update-expense" class="home-link">Update Expense</a>
      <a routerLink="/search-expenses" class="home-link">Search Expenses</a>
      <a routerLink="/delete-expense" class="home-link">Delete Expense</a>
      <a routerLink="/list-categories" class="home-link">List Categories</a>
      <a routerLink="/read-category-by-id" class="home-link"
        >Read Category by ID</a
      >
    </div>
  `,
  styles: `
    .home-link-wrapper {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-evenly;
      gap: 10px;
    }

    .home-link {
      text-align: center;
      text-decoration: none;
      background-color: #b9c9ed;
      cursor: pointer;
      padding: 2rem;
      border: 1px solid #192a53;
      border-radius: 10px;
      margin-top: 2rem;
      flex: 0 0 25%;
    }

    .home-link:hover {
      background-color: #798dbd;
    }
  `,
})
export class HomeComponent implements OnInit {
  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
  }
}
