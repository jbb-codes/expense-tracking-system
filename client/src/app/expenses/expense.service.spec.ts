/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * Modified: Jarren Bess, 7/7/2026
 * Modified: Amanda Ruff, 7/8/2026
 * File: expense.service.spec.ts
 * Description: Unit tests for the Create and List Expense service methods.
 *
 * Changes (Jarren Bess, 7/7/2026):
 * - Added a test for getExpenses() so the new List Expenses view's data
 *   source has the same coverage as the existing create method.
 *
 * Changes (Amanda Ruff, 7/8/2026):
 * - Updated the service tests to use the Angular environment configuration
 *   instead of a hardcoded API URL.
 * - This keeps the tests synchronized with expense.service.ts for both
 *   development and production environments.
 *
 * Changes (Kaitlyn Kelly 7/11/2026):
 * -Added username to mockExpenses
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ExpenseService } from './expense.service';
import { environment } from '../../environments/environment';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ExpenseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Amanda Ruff
   * Verifies that the ExpenseService requests all expense records
   * using the API URL defined in the Angular environment configuration.
   */
  it('should send a GET request to fetch all expenses', () => {
    const mockExpenses = [
      {
        userId: 1000,
        username: 'testuser',
        categoryId: 1,
        amount: 25.5,
        description: 'Lunch',
        date: '2026-07-06',
      },
    ];

    service.getExpenses().subscribe((expenses) => {
      expect(expenses).toEqual(mockExpenses);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/expenses`);
    expect(req.request.method).toBe('GET');
    req.flush(mockExpenses);
  });
});
