/**
 * Author: Kaitlyn Kelly
 * Week 8 - Sprint 3
 * File: read-category-by-id.component.spec.ts
 * Description: Unit tests for the ReadCategoryByIdComponent
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadCategoryByIdComponent } from './read-category-by-id.component';
import { AuthService } from '../../auth/auth.service';
import { CategoryService } from '../category.service';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

class MockAuthService {
  getUserId() {
    return 123;
  }
}

class MockCategoryService {
  getCategories(userId: number) {
    return of([
      { _id: 'cat1', userId: 123, categoryId: 1, name: 'Food' },
      { _id: 'cat2', userId: 123, categoryId: 2, name: 'Travel' },
    ]);
  }

  getExpensesByCategory(categoryId: number) {
    if (categoryId === 1) {
      return of([
        {
          _id: 'exp1',
          userId: 123,
          categoryId: 1,
          categoryName: 'Food',
          amount: 20,
          description: 'Lunch',
          date: new Date().toISOString(),
        },
      ]);
    }

    if (categoryId === 2) {
      return of([
        {
          _id: 'exp2',
          userId: 123,
          categoryId: 2,
          categoryName: 'Travel',
          amount: 100,
          description: 'Gas',
          date: new Date().toISOString(),
        },
        {
          _id: 'exp3',
          userId: 123,
          categoryId: 2,
          categoryName: 'Travel',
          amount: 750,
          description: 'Hotel',
          date: new Date().toISOString(),
        },
      ]);
    }

    return of([]);
  }
}

describe('ReadCategoryByIdComponent', () => {
  let component: ReadCategoryByIdComponent;
  let fixture: ComponentFixture<ReadCategoryByIdComponent>;
  let categoryService: MockCategoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadCategoryByIdComponent],
      providers: [
        provideRouter([]),
        { provide: CategoryService, useClass: MockCategoryService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadCategoryByIdComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService) as any;

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(component.userCategories.length).toBe(2);
    expect(component.userCategories[0].name).toBe('Food');
    expect(component.userCategories[1].name).toBe('Travel');
  });

  it('should load expenses for selected category', () => {
    component.categorySelectForm.setValue({ categoryId: '2' });

    component.onSelectCategory();

    expect(component.selectedExpenses.length).toBe(2);
    expect(component.selectedExpenses[0].categoryName).toBe('Travel');
  });

  it('should show error when no expenses exist', () => {
    component.categorySelectForm.setValue({ categoryId: '999' });

    component.onSelectCategory();

    expect(component.selectedExpenses.length).toBe(0);
    expect(component.errorMessage).toBe('No expenses found for this category');
  });

  // Guard against the ID datalist going stale: a failed lookup (deleted/renamed
  // category) refreshes the suggestion list instead of leaving old IDs cached
  it('should refresh the category datalist after a lookup that finds nothing', () => {
    const getCategoriesSpy = spyOn(
      categoryService,
      'getCategories',
    ).and.callThrough();

    component.categorySelectForm.setValue({ categoryId: '999' });
    component.onSelectCategory();

    expect(getCategoriesSpy).toHaveBeenCalledTimes(1);
  });

  // Free-text search replaces the raw-ID <select> so users don't have to
  // already know a category's internal ID before they can look it up
  it('should render a text search input for the category ID instead of a select', () => {
    expect(fixture.nativeElement.querySelector('select')).toBeNull();

    const input = fixture.nativeElement.querySelector(
      'input[formControlName="categoryId"]',
    );
    expect(input).not.toBeNull();
    expect(input.getAttribute('type')).toBe('text');
  });

  it('should show the results-meta line above the expenses table', () => {
    component.categorySelectForm.setValue({ categoryId: '2' });
    component.onSelectCategory();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.result-table')).not.toBeNull();
    const meta = fixture.nativeElement.querySelector('.results-meta');
    expect(meta.textContent).toContain('2');
  });
});
