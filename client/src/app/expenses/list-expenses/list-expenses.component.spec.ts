/**
 * Author: Jarren Bess
 * Week 6 - Sprint 1
 * File: list-expenses.component.spec.ts
 * Description: Unit tests for the List Expenses Angular component.
 *
 * Changes (Kaitlyn Kelly 7/11/2026):
 * -Added username to mockExpenses
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ListExpensesComponent } from './list-expenses.component';
import { ExpenseService } from '../expense.service';

describe('ListExpensesComponent', () => {
  let component: ListExpensesComponent;
  let fixture: ComponentFixture<ListExpensesComponent>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;

  const mockExpenses = [
    {
      _id: '1',
      userId: 1000,
      username: 'testuser',
      categoryId: 1,
      categoryName: 'Food',
      amount: 25.5,
      description: 'Lunch',
      date: '2026-07-06',
    },
    {
      _id: '2',
      userId: 1000,
      username: 'testuser',
      categoryId: 2,
      categoryName: 'Drinks',
      amount: 10,
      description: 'Coffee',
      date: '2026-07-05',
    },
  ];

  beforeEach(async () => {
    expenseServiceSpy = jasmine.createSpyObj('ExpenseService', ['getExpenses']);

    await TestBed.configureTestingModule({
      imports: [ListExpensesComponent],
      providers: [{ provide: ExpenseService, useValue: expenseServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListExpensesComponent);
    component = fixture.componentInstance;
  });

  // Confirm the component pulls data from the service as soon as it loads, not on demand
  it('should call getExpenses on init', () => {
    expenseServiceSpy.getExpenses.and.returnValue(of(mockExpenses));

    fixture.detectChanges();

    expect(expenseServiceSpy.getExpenses).toHaveBeenCalled();
  });

  // Verify successful API data actually reaches the template-bound property
  it('should populate the expenses list when data loads successfully', () => {
    expenseServiceSpy.getExpenses.and.returnValue(of(mockExpenses));

    fixture.detectChanges();

    expect(component.expenses).toEqual(mockExpenses);
  });

  // Verify the table renders the category name rather than the raw category ID
  it('should display categoryName instead of categoryId in the table', () => {
    expenseServiceSpy.getExpenses.and.returnValue(of(mockExpenses));

    fixture.detectChanges();

    const cellText = fixture.nativeElement.textContent as string;
    expect(cellText).toContain('Food');
    expect(cellText).toContain('Drinks');
  });

  // Guard against a failed request leaving stale or partial data on screen
  it('should set an error message when loading expenses fails', () => {
    expenseServiceSpy.getExpenses.and.returnValue(
      throwError(() => new Error('Network error')),
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Error loading expenses.');
    expect(component.expenses).toEqual([]);
  });
});
