/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * File: create-expense.component.spec.ts
 * Description: Unit tests for the Create Expense Angular component.
 *
 * Changes (Kaitlyn Kelly 7/11/2026):
 * -Added username to mockExpenses
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CreateExpenseComponent } from './create-expense.component';
import { ExpenseService } from '../expense.service';

describe('CreateExpenseComponent', () => {
  let component: CreateExpenseComponent;
  let fixture: ComponentFixture<CreateExpenseComponent>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;

  beforeEach(async () => {
    expenseServiceSpy = jasmine.createSpyObj('ExpenseService', ['createExpense']);

    await TestBed.configureTestingModule({
      imports: [CreateExpenseComponent],
      providers: [
        { provide: ExpenseService, useValue: expenseServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the form invalid when required fields are empty', () => {
    component.expenseForm.setValue({
      userId: null,
      categoryId: null,
      amount: null,
      description: '',
      date: ''
    });

    expect(component.expenseForm.invalid).toBeTrue();
  });

  it('should call createExpense when the form is valid', () => {
    expenseServiceSpy.createExpense.and.returnValue(of({
      userId: 1000,
      username: 'testuser',
      categoryId: 1,
      amount: 25.5,
      description: 'Lunch',
      date: '2026-07-06'
    }));

    component.expenseForm.setValue({
      userId: 1000,
      categoryId: 1,
      amount: 25.5,
      description: 'Lunch',
      date: '2026-07-06'
    });

    component.onSubmit();

    expect(expenseServiceSpy.createExpense).toHaveBeenCalled();
  });
});
