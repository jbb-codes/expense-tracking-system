/**
 * Author: Kaitlyn Kelly
 * Week 8 - Sprint 2
 * File: read-category-by-id.component.spec.ts
 * Description: Unit tests for the ReadCategoryByIdComponent
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadCategoryByIdComponent } from './read-category-by-id.component';
import { ExpenseService } from '../expense.service';
import { AuthService } from '../../auth/auth.service';
import { of, throwError } from 'rxjs';

class MockAuthService {
  getUserId() {
    return 123; // pretend logged-in user
  }
}

class MockExpenseService {
  getExpenses(userId: number) {
    return of([
      {
        _id: 'exp1',
        userId: 'exp1',
        username: 'testuser',
        categoryId: 1,
        categoryName: 'Food',
        amount: 20,
        description: 'Lunch',
        date: new Date().toISOString(),
      },
      {
        _id: 'exp2',
        userId: 'exp2',
        username: 'testuser',
        categoryId: 2,
        categoryName: 'Travel',
        amount: 100,
        description: 'Gas',
        date: new Date().toISOString(),
      },
      {
        _id: 'exp3',
        userId: 'exp3',
        username: 'testuser',
        categoryId: 2,
        categoryName: 'Travel',
        amount: 750,
        description: 'Hotel',
        date: new Date().toISOString(),
      },
    ]);
  }

  getCategoryById(expenseId: string) {
    return of({
      _id: expenseId,
      userId: 123,
      username: 'testuser',
      categoryId: 2,
      categoryName: 'Travel',
      amount: 100,
      description: 'Gas',
      date: new Date('2024-01-01').toISOString(),
    });
  }
}

describe('ReadCategoryByIdComponent', () => {
  let component: ReadCategoryByIdComponent;
  let fixture: ComponentFixture<ReadCategoryByIdComponent>;
  let expenseService: MockExpenseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadCategoryByIdComponent],
      providers: [
        { provide: ExpenseService, useClass: MockExpenseService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadCategoryByIdComponent);
    component = fixture.componentInstance;
    expenseService = TestBed.inject(ExpenseService) as any;

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user expenses and extract unique categories', () => {
    expect(component.userExpenses.length).toBe(3);

    // should extract categories 1 and 2 only
    expect(component.userCategories.length).toBe(2);
    expect(component.userCategories[0].categoryId).toBe(1);
    expect(component.userCategories[1].categoryId).toBe(2);
  });

  it('should filter expenses correctly when a category is selected', () => {
    component.categorySelectForm.setValue({ categoryId: '2' });

    component.onSelectCategory();

    expect(component.selectedExpenses.length).toBe(2);
    expect(component.selectedExpenses[0]._id).toBe('exp2');
    expect(component.selectedExpenses[1]._id).toBe('exp3');

    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('Expenses loaded');
  });

  it('should display error message when category load fails', () => {
    spyOn(expenseService, 'getExpenses').and.returnValue(
      throwError(() => new Error('fail')),
    );

    component.loadUserCategories(123);

    expect(component.errorMessage).toBe('Unable to load categories');
  });
});
