/**
 * Author: Kaitlyn Kelly
 * Week 9 - Sprint 4
 * File: delete-category.component.ts
 * Description: Angular component to delete an category
 **/

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Category, CategoryService } from '../category.service';
import { AuthService } from '../../auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Delete a Category</h1>

    @if (errorMessage) {
      <p class="error-msg">{{ errorMessage }}</p>
    }

    <table>
      <thead>
        <tr>
          <th>Category ID</th>
          <th>Category Name</th>
          <th>Related Expenses</th>
          <th>Delete</th>
        </tr>
      </thead>

      <tbody>
        @for (cat of categories; track cat) {
          <tr>
            <td>{{ cat.categoryId }}</td>
            <td>{{ cat.name }}</td>
            <td>{{ expenseCounts[cat.categoryId] ?? 0 }}</td>

            <td>
              <button
                class="delete-btn"
                (click)="attemptDelete(cat)"
                aria-label="Delete item"
              >
                <svg
                  xmlns="http://w3.org"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path
                    d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        }
      </tbody>
    </table>

    <a routerLink="/list-categories" class="btn">&#8592; Back</a>
  `,
  styles: `
    .delete-btn {
      background-color: transparent;
      border: none;
      color: #f11212;
      cursor: pointer;
    }

    .delete-btn:hover {
      color: #9e0d0d;
    }
  `,
})
export class DeleteCategoryComponent implements OnInit {
  categories: Category[] = [];
  expenseCounts: Record<number, number | undefined> = {};   // store counts per category
  errorMessage = '';

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    this.categoryService.getCategories(userId).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.errorMessage = '';

        // Fetch expense counts for each category
        categories.forEach(cat => {
          this.categoryService.getExpenseCount(cat.categoryId).subscribe({
            next: ({ count }) => {
              this.expenseCounts[cat.categoryId] = count;
            },
            error: () => {
              this.expenseCounts[cat.categoryId] = 0; // fallback
            }
          });
        });
      },
      error: () => {
        this.errorMessage = 'Error loading categories.';
      },
    });
  }

  attemptDelete(cat: Category): void {
    this.categoryService.getExpenseCount(cat.categoryId).subscribe({
      next: ({ count }) => {
        if (count > 0) {
          this.errorMessage = `Category "${cat.name}" cannot be deleted because it has ${count} related expenses.`;
          return;
        }

        this.deleteCategory(cat.categoryId);
      },
      error: () => {
        this.errorMessage = 'Error checking related expenses.';
      }
    });
  }

  deleteCategory(categoryId: number): void {
  this.categoryService.deleteCategory(categoryId).subscribe({
    next: () => {
      this.categories = this.categories.filter(cat => cat.categoryId !== categoryId);
      delete this.expenseCounts[categoryId];

      this.errorMessage = '';
    },
    error: () => {
      this.errorMessage = 'Error deleting category.';
    }
  });
}

}
