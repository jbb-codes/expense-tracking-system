/**
 * Author: Kaitlyn Kelly
 * Week 6 - Sprint 1
 * File: read-expense-by-id.component.spec.ts
 * Description: Unit tests for the ReadExpenseByIdComponent
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadExpenseByIdComponent } from './read-expense-by-id.component';
import { ExpenseService } from '../expense.service';
import { AuthService } from '../../auth/auth.service';
import { of, throwError } from 'rxjs';


class MockAuthService {
  getUserId() {
    return 123; // pretend logged-in user
  }
}


class MockExpenseService {
  getExpenseByUser(userId: number) {
    return of([
      {
        _id: 'exp1',
        userId,
        username: 'testuser',
        categoryId: 1,
        categoryName: 'Food',
        amount: 20,
        description: 'Lunch',
        date: new Date().toISOString()
      },
      {
        _id: 'exp2',
        userId,
        username: 'testuser',
        categoryId: 2,
        categoryName: 'Travel',
        amount: 100,
        description: 'Gas',
        date: new Date().toISOString()
      }
    ]);
  }

  getExpenseById(expenseId: string) {
    return of({
      _id: expenseId,
      userId: 123,
      username: 'testuser',
      categoryId: 2,
      categoryName: 'Travel',
      amount: 100,
      description: 'Gas',
      date: new Date('2024-01-01').toISOString()
    });
  }
}

describe('ReadExpenseByIdComponent', () => {
  let component: ReadExpenseByIdComponent;
  let fixture: ComponentFixture<ReadExpenseByIdComponent>;
  let expenseService: MockExpenseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadExpenseByIdComponent],
      providers: [
        { provide: ExpenseService, useClass: MockExpenseService },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReadExpenseByIdComponent);
    component = fixture.componentInstance;
    expenseService = TestBed.inject(ExpenseService) as any;

    fixture.detectChanges(); // triggers ngOnInit
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should populate userExpenses based on userId', () => {
    expect(component.userExpenses.length).toBe(2);
    expect(component.userExpenses[0]._id).toBe('exp1');
    expect(component.userExpenses[1]._id).toBe('exp2');
  });


  it('should populate selectedExpense when valid expenseId is chosen', () => {
    component.expenseSelectForm.setValue({ expenseId: 'exp2' });

    component.onSelectExpense();

    expect(component.selectedExpense).toBeTruthy();
    expect(component.selectedExpense._id).toBe('exp2');
    expect(component.selectedExpense.categoryName).toBe('Travel');
    expect(component.errorMessage).toBe('');
  });


  it('should display error message when expense load fails', () => {
    spyOn(expenseService, 'getExpenseById')
      .and.returnValue(throwError(() => new Error('fail')));

    component.expenseSelectForm.setValue({ expenseId: 'exp1' });
    component.onSelectExpense();

    expect(component.errorMessage).toBe('Unable to load expense details');
    expect(component.selectedExpense).toBeNull();
  });
});
