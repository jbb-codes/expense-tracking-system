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
 *
 * Changes (Kaitlyn Kelly, 7/12/2026):
 * - Added deleteExpense service to support the DeleteExpenseComponent
 * - Issues an HTTP DELETE request to remove an expense record according to its MongoDB _id
 * - Updated the Expense interfact to include _id for the functionality above
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Expense {
  _id: string;
  userId: number;
  username: string;
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
   * Jarren Bess
   * Week 6 - Sprint 1
   * Fetches all expense records so the List Expenses view has data to render.
   */
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  /**
   * Kaitlyn Kelly, 7/10/26
   * Added service methods to allow the ReadExpenseByIdComponent to:
   * 1. Authenticate a user by userId and passsword,
   * 2. Retrieve all expenses for a user,
   * 3. Fetch a selected expense to display its details
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, {
      username,
      password,
    });
  }

  getExpenseByUser(userId: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl, { params: { userId } });
  }

  getExpenseById(expenseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${expenseId}`);
  }

  /**
   * Amanda Ruff
   * Week 7 - Sprint 2
   * Sends an updated expense record to the Express Update Expense API.
   *
   * @param expenseId MongoDB ID of the expense being updated.
   * @param expense Updated expense form values.
   * @returns The updated expense returned by the API.
   */
  updateExpense(expenseId: string, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${expenseId}`, expense);
  }

  /**
   * Jarren Bess
   * Week 7 - Sprint 2
   * Searches a user's expenses by a case-insensitive description match.
   *
   * @param userId ID of the user whose expenses are being searched.
   * @param description Text to match against the expense description field.
   * @returns The matching expenses for that user.
   */
  searchExpenses(userId: number, description: string): Observable<Expense[]> {
    const params = new HttpParams().set('description', description);
    return this.http.get<Expense[]>(`${this.apiUrl}/user/${userId}/search`, {
      params,
    });
  }

  deleteExpense(id: string) {
    return this.http.delete(`/api/expenses/${id}`);
  }
}
