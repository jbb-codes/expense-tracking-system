/**
 * Author: Jarren Bess
 * Week 8 - Sprint 3
 * File: list-categories.component.ts
 * Description: Angular component that lists all categories for the authenticated user.
 *
 * Kaitlyn Kelly, 7/26/2026:
 * - Added DeleteCategory to nav
 * - Added CreateCategory to nav
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category, CategoryService } from '../category.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-list-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Categories</h1>

    <h2>Category Actions</h2>
    <nav class="page-actions">
      <a routerLink="/create-category" class="btn">Create Category</a>
      <a routerLink="/search-categories" class="btn">Search Categories</a>
      <a routerLink="/read-category-by-id" class="btn">Search Category by ID</a>
      <a routerLink="/update-category" class="btn">Update Category</a>
      <a routerLink="/delete-category" class="btn">Delete Category</a>
    </nav>

    @if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
    }

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        @for (category of categories; track category) {
          <tr>
            <td>{{ category.name }}</td>
            <td>{{ category.categoryId }}</td>
            <td>{{ category.description }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: ``,
})
export class ListCategoriesComponent implements OnInit {
  categories: Category[] = [];
  errorMessage = '';

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.categoryService.getCategories(userId).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.errorMessage = '';
      },
      error: () => {
        this.categories = [];
        this.errorMessage = 'Error loading categories.';
      },
    });
  }
}
