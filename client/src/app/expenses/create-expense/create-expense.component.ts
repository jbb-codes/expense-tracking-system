/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * File: create-expense.component.ts
 * Description: Angular component for the Create Expense form.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-create-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-expense.component.html',
  styleUrl: './create-expense.component.css'
})
export class CreateExpenseComponent {
  successMessage = '';
  errorMessage = '';
  expenseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService
  ) {
    this.expenseForm = this.fb.group({
      userId: [1000, [Validators.required]],
      categoryId: [1, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: [''],
      date: ['', [Validators.required]]
    });
  }

  /**
   * Amanda Ruff
   * Handles form submission for creating a new expense.
   */
  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    this.expenseService.createExpense(this.expenseForm.value).subscribe({
      next: () => {
        this.successMessage = 'Expense created successfully.';
        this.errorMessage = '';
        this.expenseForm.reset({
          userId: 1000,
          categoryId: 1,
          amount: null,
          description: '',
          date: ''
        });
      },
      error: () => {
        this.errorMessage = 'Error creating expense.';
        this.successMessage = '';
      }
    });
  }
}
