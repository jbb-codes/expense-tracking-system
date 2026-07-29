import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Category, CategoryService } from '../category.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-search-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Search Categories</h1>

    <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="field-row">
      <div class="search-input-wrap">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          id="name"
          type="text"
          formControlName="name"
          placeholder="Search by name…"
        />
      </div>

      <button type="submit" class="btn">Search</button>
    </form>

    @if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
    }

    @if (categories.length) {
      <div class="results">
        <div class="table-scroll">
          <table class="result-table">
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
        </div>
        <p class="results-meta">
          {{ categories.length }} result{{
            categories.length === 1 ? '' : 's'
          }}
          for "{{ lastSearchTerm }}"
        </p>
      </div>
    } @else if (hasSearched) {
      <div class="empty-state">
        No categories found for "{{ lastSearchTerm }}".
      </div>
    }
  `,
  styles: ``,
})
export class SearchCategoriesComponent {
  categories: Category[] = [];
  errorMessage = '';
  hasSearched = false;
  lastSearchTerm = '';
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private authService: AuthService,
  ) {
    this.searchForm = this.fb.group({
      name: [''],
    });
  }

  /**
   * Sends the logged-in user's ID and the entered search term to the
   * Search Categories API and populates the results table.
   */
  onSearch(): void {
    const userId = this.authService.getUserId();
    const { name } = this.searchForm.value;

    this.categoryService.searchCategories(userId, name).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.errorMessage = '';
        this.hasSearched = true;
        this.lastSearchTerm = name;
      },
      error: () => {
        this.categories = [];
        this.errorMessage = 'Error searching categories.';
        this.hasSearched = true;
        this.lastSearchTerm = name;
      },
    });
  }
}
