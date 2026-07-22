/**
 * Author: Amanda Ruff
 * Week 8 - Sprint 3
 * File: create-category.component.spec.ts
 * Description: Unit tests for the Create Category component.
 *
 * Changes (Amanda Ruff, 7/22/2026):
 * - Updated tests after converting the component to a reactive form.
 * - Replaced category object assignments with categoryForm.setValue().
 * - Replaced createCategory() calls with onSubmit().
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { CreateCategoryComponent } from './create-category.component';
import { CategoryService } from '../category.service';
import { AuthService } from '../../auth/auth.service';

describe('CreateCategoryComponent', () => {
  let component: CreateCategoryComponent;
  let fixture: ComponentFixture<CreateCategoryComponent>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    /**
     * Amanda Ruff
     * Week 8 - Sprint 3
     *
     * Creates mock services so these tests do not make
     * real HTTP requests or depend on localStorage.
     */
    categoryServiceSpy = jasmine.createSpyObj<CategoryService>(
      'CategoryService',
      ['createCategory'],
    );

    authServiceSpy = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['getUserId'],
    );

    authServiceSpy.getUserId.and.returnValue(1000);

    await TestBed.configureTestingModule({
      imports: [CreateCategoryComponent, ReactiveFormsModule],
      providers: [
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

    fixture = TestBed.createComponent(CreateCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Confirms that Angular creates the component successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Amanda Ruff
   * Week 8 - Sprint 3
   *
   * Confirms that the form starts with the authenticated user's ID.
   */
  it('should initialize the form with the authenticated user ID', () => {
    expect(component.categoryForm.get('userId')?.value).toBe(1000);
    expect(authServiceSpy.getUserId).toHaveBeenCalled();
  });

  /**
   * Amanda Ruff
   * Week 8 - Sprint 3
   *
   * Confirms that an invalid form is rejected before
   * the service method is called.
   */
  it('should display an error when required fields are missing', () => {
    component.categoryForm.setValue({
      userId: 1000,
      categoryId: null,
      name: '',
      description: '',
    });

    component.onSubmit();

    expect(component.errorMessage).toBe(
      'Please complete all required fields.',
    );
    expect(categoryServiceSpy.createCategory).not.toHaveBeenCalled();
  });

  /**
   * Amanda Ruff
   * Week 8 - Sprint 3
   *
   * Confirms that valid category information is submitted
   * and a success message is displayed.
   */
  it('should create a category when valid data is provided', () => {
    const newCategory = {
      userId: 1000,
      categoryId: 5,
      name: 'Transportation',
      description: 'Gas, transit, and vehicle expenses',
    };

    const createdCategory = {
      _id: 'category-object-id',
      ...newCategory,
    };

    categoryServiceSpy.createCategory.and.returnValue(
      of(createdCategory),
    );

    component.categoryForm.setValue(newCategory);

    component.onSubmit();

    expect(categoryServiceSpy.createCategory).toHaveBeenCalledWith(
      newCategory,
    );
    expect(component.successMessage).toBe(
      'Transportation was created successfully.',
    );
    expect(component.errorMessage).toBe('');

    // Confirm the form resets but keeps the authenticated user ID.
    expect(component.categoryForm.value).toEqual({
      userId: 1000,
      categoryId: null,
      name: '',
      description: '',
    });
  });

  /**
   * Amanda Ruff
   * Week 8 - Sprint 3
   *
   * Confirms that an API error is displayed when the
   * category cannot be created.
   */
  it('should display an API error when category creation fails', () => {
    categoryServiceSpy.createCategory.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Category name already exists.',
        },
      })),
    );

    component.categoryForm.setValue({
      userId: 1000,
      categoryId: 5,
      name: 'Transportation',
      description: 'Gas and transit',
    });

    component.onSubmit();

    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe(
      'Category name already exists.',
    );
  });
});
