/**
 * File: category.service.ts
 * Description: Service used to fetch a user's expense categories from the
 * Express API, so Create/Update Expense forms can render a category-name
 * dropdown instead of a raw numeric categoryId input.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  categoryId: number;
  userId: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(userId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/user/${userId}`);
  }
}
