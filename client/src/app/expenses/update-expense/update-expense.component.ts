/**
 * Author: Amanda Ruff
 * Date: 7/12/2026
 * Week 7 - Sprint 2
 * File: update-expense.component.ts
 * Description: Angular component used to select, load, edit,
 * and update an existing expense.
 */

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExpenseService } from '../expense.service';
import { Category, CategoryService } from '../../categories/category.service';
import { AuthService } from '../../auth/auth.service';

const SELECT_MESSAGE_DURATION_MS = 3000;

@Component({
  selector: 'app-update-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Update Expense</h1>

    @if (categoryErrorMessage) {
      <p class="error-msg">{{ categoryErrorMessage }}</p>
    }

    <!--
      Amanda Ruff
      Allows the user to select an existing expense before editing it.
    -->
    <form [formGroup]="expenseSelectForm" (ngSubmit)="onSelectExpense()">
      <label for="expenseId">Select Expense</label>

      <select id="expenseId" formControlName="expenseId">
        <option value="">Choose an expense</option>

        @for (expense of userExpenses; track expense._id) {
          <option [value]="expense._id">
            {{ expense.description || expense._id }}
          </option>
        }
      </select>

      <button type="submit">Load Expense</button>

      @if (selectMessage) {
        <p class="success-msg">{{ selectMessage }}</p>
      }

      @if (selectErrorMessage) {
        <p class="error-msg">{{ selectErrorMessage }}</p>
      }
    </form>

    <!--
      Amanda Ruff
      Displays the editable expense form after a record is loaded.
    -->
    @if (selectedExpenseId) {
      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()">
        <label for="categoryId">Category</label>
        <select id="categoryId" formControlName="categoryId">
          <option value="">Choose a category</option>

          @for (category of categories; track category.categoryId) {
            <option [ngValue]="category.categoryId">{{ category.name }}</option>
          }
        </select>

        <label for="amount">Amount</label>
        <input id="amount" type="number" step="0.01" formControlName="amount" />

        <label for="description">Description</label>
        <input id="description" type="text" formControlName="description" />

        <label for="date">Date</label>
        <input id="date" type="date" formControlName="date" />

        <button type="submit">Update Expense</button>

        @if (successMessage) {
          <p class="success-msg">{{ successMessage }}</p>
        }

        @if (errorMessage) {
          <p class="error-msg">{{ errorMessage }}</p>
        }
      </form>
    }
  `,
  styles: `
    form {
      margin-bottom: 2rem;
    }

    label {
      display: block;
      margin-top: 1rem;
    }

    input,
    select {
      display: block;
      margin-top: 0.25rem;
    }

    button {
      margin-top: 1rem;
    }
  `,
})
export class UpdateExpenseComponent implements OnInit, OnDestroy {
  successMessage = '';
  errorMessage = '';
  selectMessage = '';
  selectErrorMessage = '';
  categoryErrorMessage = '';

  userExpenses: any[] = [];
  categories: Category[] = [];
  selectedExpenseId = '';

  expenseSelectForm: FormGroup;
  expenseForm: FormGroup;

  private selectMessageTimeoutId?: ReturnType<typeof setTimeout>;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private authService: AuthService,
  ) {
    /**
     * Amanda Ruff
     * Form used to choose the expense that will be updated.
     */
    this.expenseSelectForm = this.fb.group({
      expenseId: ['', Validators.required],
    });

    /**
     * Amanda Ruff
     * Form containing the editable expense fields.
     */
    this.expenseForm = this.fb.group({
      categoryId: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: [''],
      date: ['', Validators.required],
    });
  }

  /**
   * Amanda Ruff
   * Loads the authenticated user's expenses when the component starts.
   */
  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.loadUserExpenses(userId);
    this.loadCategories(userId);
  }

  ngOnDestroy(): void {
    clearTimeout(this.selectMessageTimeoutId);
  }

  /**
   * Amanda Ruff
   * Retrieves expenses belonging to the current user for the dropdown.
   */
  loadUserExpenses(userId: number): void {
    this.expenseService.getExpenses(userId).subscribe({
      next: (expenses) => {
        this.userExpenses = expenses;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Unable to load expenses.';
        this.successMessage = '';
      },
    });
  }

  /**
   * Retrieves the current user's categories so the category
   * field can render as a name dropdown instead of a numeric input.
   */
  loadCategories(userId: number): void {
    this.categoryService.getCategories(userId).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.categoryErrorMessage = '';
      },
      error: () => {
        this.categoryErrorMessage = 'Unable to load categories.';
      },
    });
  }

  /**
   * Amanda Ruff
   * Loads the selected expense and fills the update form
   * with its current values.
   */
  onSelectExpense(): void {
    if (this.expenseSelectForm.invalid) {
      clearTimeout(this.selectMessageTimeoutId);
      this.selectErrorMessage = 'Please select an expense.';
      this.selectMessage = '';
      return;
    }

    const expenseId = this.expenseSelectForm.value.expenseId;

    this.expenseService.getExpenseById(expenseId).subscribe({
      next: (expense) => {
        this.selectedExpenseId = expenseId;

        /**
         * Amanda Ruff
         * Converts the returned date into the YYYY-MM-DD format
         * required by an HTML date input.
         */
        const formattedDate = expense.date
          ? String(expense.date).substring(0, 10)
          : '';

        this.expenseForm.patchValue({
          categoryId: expense.categoryId,
          amount: expense.amount,
          description: expense.description || '',
          date: formattedDate,
        });

        this.showSelectMessage('Expense loaded successfully.');
      },
      error: () => {
        clearTimeout(this.selectMessageTimeoutId);
        this.selectErrorMessage = 'Unable to load the selected expense.';
        this.selectMessage = '';
      },
    });
  }

  /**
   * Shows the "expense loaded" success message and clears it after a
   * few seconds so it doesn't linger once the user selects another
   * expense or submits the update form.
   */
  private showSelectMessage(message: string): void {
    clearTimeout(this.selectMessageTimeoutId);

    this.selectMessage = message;
    this.selectErrorMessage = '';

    this.selectMessageTimeoutId = setTimeout(() => {
      this.selectMessage = '';
    }, SELECT_MESSAGE_DURATION_MS);
  }

  /**
   * Amanda Ruff
   * Sends the edited expense information to the Update Expense API.
   */
  onSubmit(): void {
    if (!this.selectedExpenseId) {
      this.errorMessage = 'Please select an expense before updating.';
      this.successMessage = '';
      return;
    }

    if (this.expenseForm.invalid) {
      this.errorMessage = 'Please complete all required fields.';
      this.successMessage = '';
      return;
    }

    /**
     * Amanda Ruff
     * Creates the update request from the current form values.
     * Username is included as an empty value because it exists
     * on the shared Expense interface but is not used by the API.
     */
    const updatedExpense = {
      _id: this.selectedExpenseId,
      username: '',
      userId: this.authService.getUserId(),
      ...this.expenseForm.value,
    };

    this.expenseService
      .updateExpense(this.selectedExpenseId, updatedExpense)
      .subscribe({
        next: () => {
          this.successMessage = 'Expense updated successfully.';
          this.errorMessage = '';

          // Refresh the dropdown after the update is completed.
          const userId = this.authService.getUserId();
          this.loadUserExpenses(userId);
        },
        error: () => {
          this.errorMessage = 'Unable to update the expense.';
          this.successMessage = '';
        },
      });
  }
}
