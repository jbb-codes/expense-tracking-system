/**
 * Author: Jarren Bess
 * Week 8 - Sprint 3
 * File: category.service.spec.ts
 * Description: Unit tests for the CategoryService.
 *
 * Changes (Amanda Ruff, 7/20/2026):
 * - Added a unit test for the createCategory() service method.
 * - Verified the POST request URL, method, body, and response.
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { CategoryService } from './category.service';
import { environment } from '../../environments/environment';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request to fetch the categories for a user', () => {
    const mockCategories = [
      {
        _id: '1',
        userId: 1000,
        categoryId: 1,
        name: 'Food',
        description: 'Food and beverages',
      },
    ];

    service.getCategories(1000).subscribe((categories) => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/categories?userId=1000`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

    /**
   * Amanda Ruff
   * Week 8 - Sprint 3
   *
   * Verifies that createCategory() sends a POST request
   * containing the new category information.
   */
  it('should send a POST request to create a category', () => {
    const newCategory = {
      userId: 1000,
      categoryId: 5,
      name: 'Transportation',
      description: 'Gas, transit, and vehicle expenses',
    };

    const mockCreatedCategory = {
      _id: 'category-object-id',
      ...newCategory,
    };

    service.createCategory(newCategory).subscribe((category) => {
      expect(category).toEqual(mockCreatedCategory);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/categories`,
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCategory);

    req.flush(mockCreatedCategory);
  });
});
