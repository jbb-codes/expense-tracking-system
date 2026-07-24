/**
 * Author: Jarren Bess
 * Week 8 - Sprint 3
 * File: category.service.ts
 * Description: Service used to send category requests to the Express API.
 *
 * Changes (Amanda Ruff, 7/20/2026):
 * - Added the createCategory() service method.
 * - Added the CreateCategory interface for new category requests.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Represents a category returned by the API.
 */
export interface Category {
  _id: string;
  userId: number;
  categoryId: number;
  name: string;
  description?: string;
}

/**
 * Amanda Ruff
 * Week 8 - Sprint 3
 *
 * Represents the information required to create a new category.
 * The _id field is not included because MongoDB creates it.
 */
export interface CreateCategory {
  userId: number;
  categoryId: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  /**
   * Jarren Bess
   * Week 8 - Sprint 3
   *
   * Fetches the category records for a given user so the
   * List Categories view has data to render.
   *
   * @param userId ID of the user whose categories are being fetched.
   * @returns An observable containing the user's categories.
   */
  getCategories(userId: number): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl, {
      params: { userId },
    });
  }

  /**
   * Amanda Ruff
   * Week 8 - Sprint 3
   *
   * Sends a POST request to create a new category.
   *
   * @param category The category information entered by the user.
   * @returns An observable containing the newly created category.
   */
  createCategory(category: CreateCategory): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }


  /**
 * Kaitlyn Kelly
 * Week 8 - Sprint 3
 *
 * Sends a GET request
 */

  getExpensesByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/category/${categoryId}`
    );
  }
}


