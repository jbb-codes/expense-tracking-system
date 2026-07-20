/**
 * Author: Jarren Bess
 * Week 8 - Sprint 3
 * File: list-categories.component.ts
 * Description: Angular component that lists all categories for the authenticated user.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Category, CategoryService } from '../category.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-list-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Categories</h1>

    @if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
    }

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        @for (category of categories; track category) {
          <tr>
            <td>{{ category.name }}</td>
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
