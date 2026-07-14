/**
 * Jarren Bess
 * Week 7 - Sprint 2
 * File: search-expenses.component.spec.ts
 * Description: Unit tests for the Search Expenses Angular component.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SearchExpensesComponent } from './search-expenses.component';
import { ExpenseService } from '../expense.service';
import { AuthService } from '../../auth/auth.service';

describe('SearchExpensesComponent', () => {
  let component: SearchExpensesComponent;
  let fixture: ComponentFixture<SearchExpensesComponent>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockExpenses = [
    {
      _id: '1',
      userId: 1000,
      username: 'testuser',
      categoryId: 1,
      amount: 25.5,
      description: 'Lunch with client',
      date: '2026-07-06',
    },
  ];

  beforeEach(async () => {
    expenseServiceSpy = jasmine.createSpyObj('ExpenseService', [
      'searchExpenses',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);
    authServiceSpy.getUserId.and.returnValue(1000);

    await TestBed.configureTestingModule({
      imports: [SearchExpensesComponent],
      providers: [
        { provide: ExpenseService, useValue: expenseServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchExpensesComponent);
    component = fixture.componentInstance;
  });

  // Confirm the search form submits the logged-in userId and entered description to the service
  it('should call searchExpenses with the logged-in userId and form description on search', () => {
    expenseServiceSpy.searchExpenses.and.returnValue(of(mockExpenses));

    component.searchForm.setValue({ description: 'lunch' });
    component.onSearch();

    expect(expenseServiceSpy.searchExpenses).toHaveBeenCalledWith(
      1000,
      'lunch',
    );
  });

  // Verify successful API data actually reaches the template-bound property
  it('should populate the expenses list when the search succeeds', () => {
    expenseServiceSpy.searchExpenses.and.returnValue(of(mockExpenses));

    component.searchForm.setValue({ description: 'lunch' });
    component.onSearch();

    expect(component.expenses).toEqual(mockExpenses);
    expect(component.errorMessage).toBe('');
  });

  // Guard against a failed search leaving stale or partial data on screen
  it('should set an error message and clear expenses when the search fails', () => {
    expenseServiceSpy.searchExpenses.and.returnValue(
      throwError(() => new Error('Network error')),
    );

    component.searchForm.setValue({ description: 'lunch' });
    component.onSearch();

    expect(component.errorMessage).toBe('Error searching expenses.');
    expect(component.expenses).toEqual([]);
  });
});
