
/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * File: expense.service.ts
 * Description: Service used to send Create Expense requests to the Express API.
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
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:3000/api/expenses';

  constructor(private http: HttpClient) {}

  createExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }
}
