/**
 * Author: Amanda Ruff
 * Date: 7/27/2026
 * Week 9 - Sprint 4
 * File: update-category.component.spec.ts
 * Description: Unit tests for the Update Category Angular component.
 *
 * Changes (Amanda Ruff, 7/27/2026):
 * - Added test coverage for component creation and category loading.
 * - Added test coverage for selecting and loading an existing category.
 * - Added test coverage for successfully updating a category.
 * - Added test coverage for required-field validation.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Category, CategoryService, UpdateCategory } from '../category.service';
import { AuthService } from '../../auth/auth.service';
import { UpdateCategoryComponent } from './update-category.component';

describe('UpdateCategoryComponent', () => {
  let component: UpdateCategoryComponent;
  let fixture: ComponentFixture<UpdateCategoryComponent>;

  /**
   * Mock services allow the component tests to run without
   * calling the real Express API or authentication storage.
   */
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  /**
   * Mock category records belonging to the authenticated user.
   */
  const mockCategories: Category[] = [
    {
      _id: 'category-one-object-id',
      userId: 1000,
      categoryId: 1,
      name: 'Food',
      description: 'Food and beverage expenses',
    },
    {
      _id: 'category-two-object-id',
      userId: 1000,
      categoryId: 2,
      name: 'Transportation',
      description: 'Gas and vehicle expenses',
    },
  ];

  beforeEach(async () => {
    /**
     * Create mock versions of the methods used by the component.
     */
    categoryServiceSpy = jasmine.createSpyObj<CategoryService>(
      'CategoryService',
      ['getCategories', 'updateCategory'],
    );

    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'getUserId',
    ]);

    /**
     * Simulate an authenticated user with userId 1000.
     */
    authServiceSpy.getUserId.and.returnValue(1000);

    /**
     * Simulate successfully loading the authenticated user's categories.
     */
    categoryServiceSpy.getCategories.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [UpdateCategoryComponent],
      providers: [
        {
          provide: CategoryService,
          useValue: categoryServiceSpy,
        },
        {
          provide: AuthService,
          useValue: authServiceSpy,
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCategoryComponent);

    component = fixture.componentInstance;

    /**
     * Runs Angular change detection and calls ngOnInit().
     */
    fixture.detectChanges();
  });

  /**
   * Amanda Ruff
   * Week 9 - Sprint 4
   *
   * Confirms that the component is created and loads the
   * authenticated user's categories during initialization.
   */
  it('should create and load the authenticated user categories', () => {
    // Confirm that Angular created the component.
    expect(component).toBeTruthy();

    // Confirm that the authenticated user ID was retrieved.
    expect(authServiceSpy.getUserId).toHaveBeenCalled();

    // Confirm that categories were requested for the correct user.
    expect(categoryServiceSpy.getCategories).toHaveBeenCalledWith(1000);

    // Confirm that the returned categories were stored.
    expect(component.userCategories).toEqual(mockCategories);

    // Confirm that no category-loading error was displayed.
    expect(component.categoryLoadErrorMessage).toBe('');
  });

  /**
   * Amanda Ruff
   * Week 9 - Sprint 4
   *
   * Confirms that selecting a category fills the editable
   * form with the category's existing values.
   */
  it('should load the selected category into the update form', () => {
    /**
     * Select the Transportation category from the dropdown.
     */
    component.categorySelectForm.setValue({
      categoryId: 2,
    });

    // Load the selected category into the edit form.
    component.onSelectCategory();

    // Confirm that the selected categoryId was stored.
    expect(component.selectedCategoryId).toBe(2);

    // Confirm that the form contains the current category values.
    expect(component.categoryForm.value).toEqual({
      name: 'Transportation',
      description: 'Gas and vehicle expenses',
    });

    // Confirm that the category-loaded message was displayed.
    expect(component.selectMessage).toBe('Category loaded successfully.');

    // Confirm that no selection error was displayed.
    expect(component.selectErrorMessage).toBe('');
  });

  /**
   * Amanda Ruff
   * Week 9 - Sprint 4
   *
   * Confirms that valid edited category values are sent
   * to the Update Category API.
   */
  it('should update a category when valid data is submitted', () => {
    /**
     * Define the updated category request body.
     */
    const updateRequest: UpdateCategory = {
      name: 'Vehicle Expenses',
      description: 'Gas, repairs, and maintenance',
    };

    /**
     * Define the category returned by the API after updating.
     */
    const updatedCategory: Category = {
      _id: 'category-two-object-id',
      userId: 1000,
      categoryId: 2,
      name: 'Vehicle Expenses',
      description: 'Gas, repairs, and maintenance',
    };

    /**
     * Simulate a successful Update Category API response.
     */
    categoryServiceSpy.updateCategory.and.returnValue(of(updatedCategory));

    // Identify the category being updated.
    component.selectedCategoryId = 2;

    // Fill the update form with valid edited values.
    component.categoryForm.setValue(updateRequest);

    // Submit the update form.
    component.onSubmit();

    /**
     * Confirm that the correct categoryId and request body
     * were sent to the service.
     */
    expect(categoryServiceSpy.updateCategory).toHaveBeenCalledWith(
      2,
      updateRequest,
    );

    // Confirm that the success message uses the updated name.
    expect(component.successMessage).toBe(
      'Vehicle Expenses was updated successfully.',
    );

    // Confirm that no update error was displayed.
    expect(component.errorMessage).toBe('');

    /**
     * Confirm that the category list was refreshed after updating.
     *
     * The first call occurs during ngOnInit(), and the second
     * occurs after the successful update.
     */
    expect(categoryServiceSpy.getCategories).toHaveBeenCalledTimes(2);
  });

  /**
   * Amanda Ruff
   * Week 9 - Sprint 4
   *
   * Confirms that the component rejects an update when
   * the required category name is missing.
   */
  it('should not update when the category form is invalid', () => {
    // Identify a category as selected.
    component.selectedCategoryId = 2;

    // Set the required category name to an invalid empty value.
    component.categoryForm.setValue({
      name: '',
      description: 'Updated description',
    });

    // Attempt to submit the invalid form.
    component.onSubmit();

    // Confirm that the service was not called.
    expect(categoryServiceSpy.updateCategory).not.toHaveBeenCalled();

    // Confirm that the expected validation message was displayed.
    expect(component.errorMessage).toBe('Please complete all required fields.');

    // Confirm that no success message was displayed.
    expect(component.successMessage).toBe('');
  });

  /**
   * Confirms that the back link to the category list is visible
   * even before a category has been selected, matching the other
   * category components.
   */
  it('should show a back link before a category is selected', () => {
    // Confirm no category has been loaded for editing yet.
    expect(component.selectedCategoryId).toBeNull();

    const backLink: HTMLAnchorElement =
      fixture.nativeElement.querySelector('a.btn');

    // Confirm the back link is rendered regardless of selection state.
    expect(backLink).toBeTruthy();
    expect(backLink.getAttribute('ng-reflect-router-link')).toBe(
      '/list-categories',
    );
  });
});
