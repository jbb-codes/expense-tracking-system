/**
 * Author: Jarren Bess
 * Week 8 - Sprint 3
 * File: list-categories.component.spec.ts
 * Description: Unit tests for the List Categories Angular component.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ListCategoriesComponent } from './list-categories.component';
import { CategoryService } from '../category.service';
import { AuthService } from '../../auth/auth.service';

describe('ListCategoriesComponent', () => {
  let component: ListCategoriesComponent;
  let fixture: ComponentFixture<ListCategoriesComponent>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockCategories = [
    {
      _id: '1',
      userId: 1000,
      categoryId: 1,
      name: 'Food',
      description: 'Food and beverages',
    },
    {
      _id: '2',
      userId: 1000,
      categoryId: 2,
      name: 'Transport',
      description: 'Gas and transit',
    },
  ];

  beforeEach(async () => {
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'getCategories',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);
    authServiceSpy.getUserId.and.returnValue(1000);

    await TestBed.configureTestingModule({
      imports: [ListCategoriesComponent],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListCategoriesComponent);
    component = fixture.componentInstance;
  });

  // Confirm the component pulls data from the service as soon as it loads, not on demand
  it('should call getCategories on init', () => {
    categoryServiceSpy.getCategories.and.returnValue(of(mockCategories));

    fixture.detectChanges();

    expect(categoryServiceSpy.getCategories).toHaveBeenCalledWith(1000);
  });

  // Verify successful API data actually reaches the template-bound property
  it('should populate the categories list when data loads successfully', () => {
    categoryServiceSpy.getCategories.and.returnValue(of(mockCategories));

    fixture.detectChanges();

    expect(component.categories).toEqual(mockCategories);
  });

  // Guard against a failed request leaving stale or partial data on screen
  it('should set an error message when loading categories fails', () => {
    categoryServiceSpy.getCategories.and.returnValue(
      throwError(() => new Error('Network error')),
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Error loading categories.');
    expect(component.categories).toEqual([]);
  });
});
