/**
 * Author: Amanda Ruff
 * Week 8 - Sprint 3
 * File: create-category.component.spec.ts
 * Description: Unit tests for the Create Category component.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CreateCategoryComponent } from './create-category.component';
import { CategoryService } from '../category.service';

describe('CreateCategoryComponent', () => {
  let component: CreateCategoryComponent;
  let fixture: ComponentFixture<CreateCategoryComponent>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;

  beforeEach(async () => {
    /**
     * Amanda Ruff
     * Week 8 - Sprint 3
     *
     * Creates a mock CategoryService so the component tests
     * do not make real HTTP requests.
     */
    categoryServiceSpy = jasmine.createSpyObj<CategoryService>(
      'CategoryService',
      ['createCategory'],
    );

    await TestBed.configureTestingModule({
      imports: [CreateCategoryComponent],
      providers: [
        {
          provide: CategoryService,
          useValue: categoryServiceSpy,
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
   * Confirms that invalid category information is rejected
   * before the service method is called.
   */
  it('should display an error when required fields are missing', () => {
    component.category = {
      userId: 1000,
      categoryId: 0,
      name: '',
      description: '',
    };

    component.createCategory();

    expect(component.errorMessage).toBe(
      'User ID, category ID, and category name are required.',
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

    component.category = { ...newCategory };

    component.createCategory();

    expect(categoryServiceSpy.createCategory).toHaveBeenCalledWith(
      newCategory,
    );
    expect(component.successMessage).toBe(
      'Transportation was created successfully.',
    );
    expect(component.errorMessage).toBe('');
    expect(component.isSubmitting).toBeFalse();
  });

  /**
   * Amanda Ruff
   * Week 8 - Sprint 3
   *
   * Confirms that an API error is displayed to the user
   * when the category cannot be created.
   */
  it('should display an API error when category creation fails', () => {
    categoryServiceSpy.createCategory.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Category name already exists.',
        },
      })),
    );

    component.category = {
      userId: 1000,
      categoryId: 5,
      name: 'Transportation',
      description: 'Gas and transit',
    };

    component.createCategory();

    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe(
      'Category name already exists.',
    );
    expect(component.isSubmitting).toBeFalse();
  });
});
