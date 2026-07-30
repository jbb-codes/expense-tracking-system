/**
 * Author: Jarren Bess
 * Week 8 - Sprint 3
 * File: category.service.ts
 * Description: Service used to send category requests to the Express API.
 *
 * Changes (Amanda Ruff, 7/20/2026):
 * - Added the createCategory() service method.
 * - Added the CreateCategory interface for new category requests.
 *
 * Changes (Kaitlyn Kelly, 7/27/2026):
 * - Added methods for retrieving expense counts and deleting categories.
 *
 * Changes (Amanda Ruff, 7/27/2026):
 * - Added the UpdateCategory interface for Sprint 4.
 * - Added the updateCategory() service method.
 * - Corrected formatting in the existing category service methods.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Represents a category returned by the Express API.
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
 * Represents the information required to create a category.
 * MongoDB creates the _id value after the category is saved.
 */
export interface CreateCategory {
  userId: number;
  categoryId: number;
  name: string;
  description?: string;
}

/**
 * Amanda Ruff
 * Week 9 - Sprint 4
 *
 * Represents the editable information sent to the
 * Update Category API.
 *
 * The categoryId is sent as part of the request URL rather
 * than as part of the request body.
 */
export interface UpdateCategory {
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  /**
   * Base URL used for all category API requests.
   */
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  /**
   * Jarren Bess
   * Week 8 - Sprint 3
   *
   * Retrieves all categories belonging to a particular user.
   *
   * @param userId Numeric ID of the authenticated user.
   * @returns Observable containing the user's categories.
   */
  getCategories(userId: number): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl, {
      params: {
        userId,
      },
    });
  }

  /**
   * Amanda Ruff
   * Week 8 - Sprint 3
   *
   * Sends a POST request to create a new category.
   *
   * @param category New category information entered by the user.
   * @returns Observable containing the created category.
   */
  createCategory(category: CreateCategory): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  /**
   * Amanda Ruff
   * Week 9 - Sprint 4
   *
   * Sends a PUT request to update an existing category.
   *
   * @param categoryId Numeric ID of the category being updated.
   * @param category Updated category name and description.
   * @returns Observable containing the updated category.
   */
  updateCategory(
    categoryId: number,
    category: UpdateCategory,
  ): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${categoryId}`, category);
  }

  /**
   * Kaitlyn Kelly
   * Week 8 - Sprint 3
   *
   * Retrieves expenses assigned to a specific category.
   *
   * @param categoryId Numeric ID of the selected category.
   * @returns Observable containing expenses assigned to the category.
   */
  getExpensesByCategory(userId: number, categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/category/${categoryId}`,
      { params: { userId } }
    );
  }

  /**
   * Kaitlyn Kelly
   * Week 9 - Sprint 4
   *
   * Retrieves the number of expenses assigned to a category.
   *
   * @param categoryId Numeric ID of the selected category.
   * @returns Observable containing the expense count.
   */
  getExpenseCount(userId: number, categoryId: number): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(
      `${this.apiUrl}/${categoryId}/expenseCount`,
      { params: { userId } }
    );
  }


  /**
   * Kaitlyn Kelly
   * Week 9 - Sprint 4
   *
   * Sends a DELETE request to remove a category.
   *
   * @param categoryId Numeric ID of the category being deleted.
   * @returns Observable containing the API response.
   */
  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${categoryId}`);
  }

  /**
   * Jarren Bess
   *
   * Sends a GET request to search a user's categories by name
   * or description.
   *
   * @param userId Numeric ID of the authenticated user.
   * @param name Search term matched against the category name.
   * @returns Observable containing the matching categories.
   */
  searchCategories(userId: number, name: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/user/${userId}/search`, {
      params: { name },
    });
  }
}
