/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * File: create-expense.component.spec.ts
 * Description: Unit tests for the Create Expense Angular component.
 *
 * Changes (Kaitlyn Kelly 7/11/2026):
 * -Added username to mockExpenses
 *
 * Changes (7/21/2026):
 * - Updated tests for the category dropdown replacing the raw categoryId input.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CreateExpenseComponent } from './create-expense.component';
import { ExpenseService } from '../expense.service';
import { Category, CategoryService } from '../../categories/category.service';
import { AuthService } from '../../auth/auth.service';

describe('CreateExpenseComponent', () => {
  let component: CreateExpenseComponent;
  let fixture: ComponentFixture<CreateExpenseComponent>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockCategories: Category[] = [
    { _id: 'cat1', userId: 1000, categoryId: 1, name: 'Food' },
    { _id: 'cat2', userId: 1000, categoryId: 2, name: 'Travel' },
  ];

  beforeEach(async () => {
    expenseServiceSpy = jasmine.createSpyObj('ExpenseService', [
      'createExpense',
    ]);
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'getCategories',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);

    authServiceSpy.getUserId.and.returnValue(1000);
    categoryServiceSpy.getCategories.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [CreateExpenseComponent],
      providers: [
        { provide: ExpenseService, useValue: expenseServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories for the current user on init', () => {
    expect(authServiceSpy.getUserId).toHaveBeenCalled();
    expect(categoryServiceSpy.getCategories).toHaveBeenCalledWith(1000);
    expect(component.categories).toEqual(mockCategories);
  });

  it('should render a dropdown option for each category', () => {
    const options: HTMLOptionElement[] =
      fixture.nativeElement.querySelectorAll('#categoryId option');

    expect(options.length).toBe(mockCategories.length);
    expect(options[0].textContent).toContain('Food');
    expect(options[1].textContent).toContain('Travel');
  });

  it('should still list a category with zero expenses as a selectable option', () => {
    const unusedCategory: Category = {
      _id: 'cat3',
      userId: 1000,
      categoryId: 3,
      name: 'Unused',
    };
    categoryServiceSpy.getCategories.and.returnValue(
      of([...mockCategories, unusedCategory]),
    );

    fixture = TestBed.createComponent(CreateExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const options: HTMLOptionElement[] =
      fixture.nativeElement.querySelectorAll('#categoryId option');

    expect(options.length).toBe(3);
    expect(component.categories).toContain(unusedCategory);
  });

  it('should mark the form invalid when required fields are empty', () => {
    component.expenseForm.setValue({
      categoryId: null,
      amount: null,
      description: '',
      date: '',
    });

    expect(component.expenseForm.invalid).toBeTrue();
  });

  it('should call createExpense with the selected categoryId and the authenticated userId when the form is valid', () => {
    expenseServiceSpy.createExpense.and.returnValue(
      of({
        _id: 'exp123',
        userId: 1000,
        username: 'testuser',
        categoryId: 2,
        amount: 25.5,
        description: 'Lunch',
        date: '2026-07-06',
      }),
    );

    component.expenseForm.setValue({
      categoryId: 2,
      amount: 25.5,
      description: 'Lunch',
      date: '2026-07-06',
    });

    component.onSubmit();

    expect(expenseServiceSpy.createExpense).toHaveBeenCalledWith(
      jasmine.objectContaining({ userId: 1000, categoryId: 2 }),
    );
  });
});
