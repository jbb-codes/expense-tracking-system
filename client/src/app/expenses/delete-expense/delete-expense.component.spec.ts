/**
 * Author: Kaitlyn Kelly
 * Week 7 - Sprint 2
 * File: delete-expense.component.spec.ts
 * Description: Unit tests for DeleteExpenseComponent
 **/

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DeleteExpenseComponent } from './delete-expense.component';
import { ExpenseService } from '../expense.service';
import { provideRouter } from '@angular/router';

describe('DeleteExpenseComponent', () => {
  let component: DeleteExpenseComponent;
  let fixture: ComponentFixture<DeleteExpenseComponent>;
  let mockService: jasmine.SpyObj<ExpenseService>;

  const mockExpenses = [
    {
      _id: '1',
      userId: 1000,
      username: 'testuser',
      categoryId: 1,
      categoryName: 'Meals',
      amount: 10,
      description: 'Test',
      date: new Date().toISOString(),
    },
    {
      _id: '2',
      userId: 1000,
      username: 'testuser',
      categoryId: 2,
      categoryName: 'Travel',
      amount: 20,
      description: 'Another',
      date: new Date().toISOString(),
    },
  ];

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('ExpenseService', [
      'getExpenses',
      'deleteExpense',
    ]);

    await TestBed.configureTestingModule({
      imports: [DeleteExpenseComponent],
      providers: [
        provideRouter([]),
        { provide: ExpenseService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteExpenseComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Loads expenses on init
  it('should load expenses on init', () => {
    mockService.getExpenses.and.returnValue(of(mockExpenses));

    component.ngOnInit();

    expect(component.expenses.length).toBe(2);
    expect(component.errorMessage).toBe('');
  });

  // deleteItem() should call the service
  it('should call deleteExpense with the correct ID', () => {
    mockService.deleteExpense.and.returnValue(of({ message: 'deleted' }));
    component.expenses = [...mockExpenses];

    component.deleteItem('1');

    expect(mockService.deleteExpense).toHaveBeenCalledWith('1');
  });

  // deleteItem() should remove the item from the UI
  it('should remove the deleted expense from the list', () => {
    mockService.deleteExpense.and.returnValue(of({ message: 'deleted' }));
    component.expenses = [...mockExpenses];

    component.deleteItem('1');

    expect(component.expenses.length).toBe(1);
    expect(component.expenses[0]._id).toBe('2');
  });

  // Confirm the table renders the category name, not the raw categoryId
  it('should display the category name in the expenses table', () => {
    mockService.getExpenses.and.returnValue(of(mockExpenses));

    component.ngOnInit();
    fixture.detectChanges();

    const tableText = fixture.nativeElement.textContent;
    expect(tableText).toContain('Meals');
    expect(tableText).toContain('Travel');
  });
});
