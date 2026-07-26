import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component';
import { AuthService } from '../auth/auth.service';
import { Expense, ExpenseService } from '../expenses/expense.service';
import { routes } from '../app.routes';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;

  const now = new Date('2026-07-23T12:00:00');

  const mockExpenses: Expense[] = [
    {
      _id: '3',
      userId: 1000,
      username: 'emily',
      categoryId: 1,
      categoryName: 'Food',
      amount: 100,
      description: 'Old lunch',
      date: '2026-06-01',
    },
    {
      _id: '1',
      userId: 1000,
      username: 'emily',
      categoryId: 1,
      categoryName: 'Food',
      amount: 12.5,
      description: 'Lunch',
      date: '2026-07-23',
    },
    {
      _id: '2',
      userId: 1000,
      username: 'emily',
      categoryId: 2,
      categoryName: 'Transportation',
      amount: 45,
      description: 'Bus Pass',
      date: '2026-07-10',
    },
  ];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUsername',
      'getUserId',
    ]);
    authServiceSpy.getUsername.and.returnValue('Emily');
    authServiceSpy.getUserId.and.returnValue(1000);

    expenseServiceSpy = jasmine.createSpyObj('ExpenseService', ['getExpenses']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ExpenseService, useValue: expenseServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    component.now = now;
  });

  it("should fetch the authenticated user's expenses on init", () => {
    expenseServiceSpy.getExpenses.and.returnValue(of(mockExpenses));

    fixture.detectChanges();

    expect(expenseServiceSpy.getExpenses).toHaveBeenCalledWith(1000);
  });

  it('should show the welcome heading with the username', () => {
    expenseServiceSpy.getExpenses.and.returnValue(of(mockExpenses));

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent).toContain(
      'Emily',
    );
  });

  it('should render the three summary stat cards computed from the expense list', () => {
    expenseServiceSpy.getExpenses.and.returnValue(of(mockExpenses));

    fixture.detectChanges();

    const values = Array.from(
      fixture.nativeElement.querySelectorAll('.stat-card__value'),
    ).map((el: any) => el.textContent.trim());

    expect(values).toEqual(['$57.50', '$12.50', '$12.50']);
  });

  it('should list recent expenses newest first with date, description, category, and amount', () => {
    expenseServiceSpy.getExpenses.and.returnValue(of(mockExpenses));

    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll(
      '.panel table tbody tr',
    );

    expect(rows.length).toBe(3);
    expect(rows[0].textContent).toContain('Lunch');
    expect(rows[0].textContent).toContain('Food');
    expect(rows[0].textContent).toContain('$12.50');
    expect(rows[1].textContent).toContain('Bus Pass');
    expect(rows[2].textContent).toContain('Old lunch');
  });

  it('should link View All Expenses, Add Expense, and Add Category to their existing routes', () => {
    expenseServiceSpy.getExpenses.and.returnValue(of(mockExpenses));

    fixture.detectChanges();

    const viewAll = fixture.nativeElement.querySelector('.view-all');
    const addExpense = fixture.nativeElement.querySelector(
      '.quick-actions a:nth-child(1)',
    );
    const addCategory = fixture.nativeElement.querySelector(
      '.quick-actions a:nth-child(2)',
    );

    expect(viewAll.getAttribute('href')).toBe('/list-expenses');
    expect(addExpense.getAttribute('href')).toBe('/create-expense');
    expect(addCategory.getAttribute('href')).toBe('/create-category');
  });

  it('should link Update Expense and Delete Expense to their existing routes', () => {
    expenseServiceSpy.getExpenses.and.returnValue(of(mockExpenses));

    fixture.detectChanges();

    const updateExpense = fixture.nativeElement.querySelector(
      '.quick-actions a:nth-child(3)',
    );
    const deleteExpense = fixture.nativeElement.querySelector(
      '.quick-actions a:nth-child(4)',
    );

    expect(updateExpense.getAttribute('href')).toBe('/update-expense');
    expect(deleteExpense.getAttribute('href')).toBe('/delete-expense');
  });

  it('should set an error message when loading expenses fails', () => {
    expenseServiceSpy.getExpenses.and.returnValue(
      throwError(() => new Error('Network error')),
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Error loading dashboard data.');
  });
});
