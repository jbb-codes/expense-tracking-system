/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * Modified: Jarren Bess, 7/7/2026
 * File: expense.service.spec.ts
 * Description: Unit tests for the Create and List Expense service methods.
 *
 * Changes (Jarren Bess, 7/7/2026):
 * - Added a test for getExpenses() so the new List Expenses view's data
 *   source has the same coverage as the existing create method.
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ExpenseService } from './expense.service';

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

  // Confirm the List Expenses view gets real data back from a successful request
  it('should send a GET request to fetch all expenses', () => {
    const mockExpenses = [
      {
        userId: 1000,
        categoryId: 1,
        amount: 25.5,
        description: 'Lunch',
        date: '2026-07-06',
      },
    ];

    service.getExpenses().subscribe((expenses) => {
      expect(expenses).toEqual(mockExpenses);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/expenses');
    expect(req.request.method).toBe('GET');
    req.flush(mockExpenses);
  });
});
