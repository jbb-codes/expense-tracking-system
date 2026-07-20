/**
 * Author: Jarren Bess
 * Week 8 - Sprint 3
 * File: category.service.spec.ts
 * Description: Unit tests for the List Categories service method.
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
});
