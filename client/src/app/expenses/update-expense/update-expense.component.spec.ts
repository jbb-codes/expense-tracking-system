/**
 * Author: Amanda Ruff
 * Date: 7/12/2026
 * Week 7 - Sprint 2
 * File: update-expense.component.spec.ts
 * Description: Unit tests for the Update Expense Angular component.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UpdateExpenseComponent } from './update-expense.component';
import { ExpenseService } from '../expense.service';
import { CategoryService } from '../../categories/category.service';
import { AuthService } from '../../auth/auth.service';

describe('UpdateExpenseComponent', () => {
  let component: UpdateExpenseComponent;
  let fixture: ComponentFixture<UpdateExpenseComponent>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    /**
     * Amanda Ruff
     * Creates mocked services so the component tests do not
     * require the Express API or authentication system.
     */
    expenseServiceSpy = jasmine.createSpyObj('ExpenseService', [
      'getExpenses',
      'getExpenseById',
      'updateExpense',
    ]);

    categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'getCategories',
    ]);

    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);

    authServiceSpy.getUserId.and.returnValue(1000);
    expenseServiceSpy.getExpenses.and.returnValue(of([]));
    categoryServiceSpy.getCategories.and.returnValue(
      of([
        { _id: 'cat1', categoryId: 1, userId: 1000, name: 'Dining' },
        { _id: 'cat2', categoryId: 2, userId: 1000, name: 'Groceries' },
      ]),
    );

    await TestBed.configureTestingModule({
      imports: [UpdateExpenseComponent],
      providers: [
        {
          provide: ExpenseService,
          useValue: expenseServiceSpy,
        },
        {
          provide: CategoryService,
          useValue: categoryServiceSpy,
        },
        {
          provide: AuthService,
          useValue: authServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateExpenseComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Amanda Ruff
   * Test 1: Confirms that Angular creates the component.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test: Confirms categories are loaded for the dropdown on init.
   */
  it('should load categories for the current user on init', () => {
    expect(categoryServiceSpy.getCategories).toHaveBeenCalledWith(1000);
    expect(component.categories).toEqual([
      { _id: 'cat1', categoryId: 1, userId: 1000, name: 'Dining' },
      { _id: 'cat2', categoryId: 2, userId: 1000, name: 'Groceries' },
    ]);
  });

  /**
   * Amanda Ruff
   * Test 2: Confirms that selecting an expense loads its
   * existing values into the update form.
   */
  it('should load the selected expense into the form', () => {
    expenseServiceSpy.getExpenseById.and.returnValue(
      of({
        _id: 'exp123',
        userId: 1000,
        categoryId: 2,
        amount: 75.5,
        description: 'Groceries',
        date: '2026-07-12T00:00:00.000Z',
      }),
    );

    component.expenseSelectForm.setValue({
      expenseId: 'exp123',
    });

    component.onSelectExpense();

    expect(expenseServiceSpy.getExpenseById).toHaveBeenCalledWith('exp123');

    expect(component.selectedExpenseId).toBe('exp123');
    expect(component.expenseForm.value).toEqual({
      userId: 1000,
      categoryId: 2,
      amount: 75.5,
      description: 'Groceries',
      date: '2026-07-12',
    });
  });

  /**
   * Amanda Ruff
   * Test 3: Confirms that a valid form calls the
   * Update Expense service method.
   */
  it('should call updateExpense when the form is valid', () => {
    expenseServiceSpy.updateExpense.and.returnValue(
      of({
        _id: 'exp123',
        userId: 1000,
        username: '',
        categoryId: 2,
        amount: 85,
        description: 'Updated groceries',
        date: '2026-07-12',
      }),
    );

    component.selectedExpenseId = 'exp123';

    component.expenseForm.setValue({
      userId: 1000,
      categoryId: 2,
      amount: 85,
      description: 'Updated groceries',
      date: '2026-07-12',
    });

    component.onSubmit();

    expect(expenseServiceSpy.updateExpense).toHaveBeenCalledWith('exp123', {
      _id: 'exp123',
      username: '',
      userId: 1000,
      categoryId: 2,
      amount: 85,
      description: 'Updated groceries',
      date: '2026-07-12',
    });

    expect(component.successMessage).toBe('Expense updated successfully.');
  });
});
