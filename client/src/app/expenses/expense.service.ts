/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * Modified: Jarren Bess, 7/7/2026
 * Modified: Amanda Ruff, 7/8/2026
 * File: expense.service.ts
 * Description: Service used to send Create and List Expense requests to the Express API.
 *
 * Changes (Jarren Bess, 7/7/2026):
 * - Added getExpenses() so the new List Expenses view has a way to load
 *   existing records instead of only being able to submit new ones.
 *
 * Changes (Amanda Ruff, 7/8/2026):
 * - Replaced the hardcoded API URL with Angular environment configuration.
 * - Updated the service to use environment.apiUrl so API endpoints can
 *   change between development and production without modifying the code.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  /**
 * Amanda Ruff
 * Uses the API base URL defined in Angular environment files.
 * This avoids hardcoding localhost and supports different
 * URLs for development and production deployments.
 */

  private apiUrl = `${environment.apiUrl}/expenses`;

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
