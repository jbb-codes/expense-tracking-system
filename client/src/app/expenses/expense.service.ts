/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * Modified: Jarren Bess, 7/7/2026
 * File: expense.service.ts
 * Description: Service used to send Create and List Expense requests to the Express API.
 *
 * Changes (Jarren Bess, 7/7/2026):
 * - Added getExpenses() so the new List Expenses view has a way to load
 *   existing records instead of only being able to submit new ones.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Expense {
  userId: number;
  categoryId: number;
  amount: number;
  description?: string;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:3000/api/expenses';

  constructor(private http: HttpClient) {}

  createExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  /**
   * @description - fetches all expense records so the List Expenses view has data to render
   */
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }
}
