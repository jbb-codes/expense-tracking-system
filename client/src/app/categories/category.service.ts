/**
 * Author: Jarren Bess
 * Week 8 - Sprint 3
 * File: category.service.ts
 * Description: Service used to send List Categories requests to the Express API.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  _id: string;
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
   * Fetches the category records for a given user so the List Categories
   * view has data to render.
   *
   * @param userId ID of the user whose categories are being fetched.
   */
  getCategories(userId: number): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl, { params: { userId } });
  }
}
