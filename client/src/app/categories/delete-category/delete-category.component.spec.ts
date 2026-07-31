import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DeleteCategoryComponent } from './delete-category.component';
import { CategoryService } from '../category.service';
import { AuthService } from '../../auth/auth.service';
import { provideRouter } from '@angular/router';

describe('DeleteCategoryComponent', () => {
  let component: DeleteCategoryComponent;
  let fixture: ComponentFixture<DeleteCategoryComponent>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'getCategories',
      'getExpenseCount',
      'deleteCategory'
    ]);

    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);
    authServiceSpy.getUserId.and.returnValue(1);

    await TestBed.configureTestingModule({
      imports: [DeleteCategoryComponent],
      providers: [
        provideRouter([]),
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteCategoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories and expense counts on init', () => {
    const mockCategories = [
      { _id: 'abc123', userId: 1, categoryId: 1, name: 'Food' },
      { _id: 'def456', userId: 1, categoryId: 2, name: 'Travel' }
    ];

    categoryServiceSpy.getCategories.and.returnValue(of(mockCategories));
    categoryServiceSpy.getExpenseCount.and.returnValue(of({ count: 3 }));

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.categories.length).toBe(2);
    expect(component.expenseCounts[1]).toBe(3);
    expect(component.expenseCounts[2]).toBe(3);
  });

  it('should prevent deletion when category has related expenses', () => {
    const mockCategory = {
      _id: 'abc123', userId: 1, categoryId: 1, name: 'Food'
    };


    categoryServiceSpy.getExpenseCount.and.returnValue(of({ count: 5 }));

    component.attemptDelete(mockCategory);

    expect(component.errorMessage).toContain('cannot be deleted');
    expect(categoryServiceSpy.deleteCategory).not.toHaveBeenCalled();
  });

  it('should delete category when no related expenses exist', () => {
    const mockCategory = {
      _id: 'abc123', userId: 1, categoryId: 1, name: 'Food'
    };

    categoryServiceSpy.getExpenseCount.and.returnValue(of({ count: 0 }));
    categoryServiceSpy.deleteCategory.and.returnValue(of({ message: 'Category deleted successfully' }));

    component.categories = [mockCategory];
    component.expenseCounts = { 1: 0 };

    component.attemptDelete(mockCategory);

    expect(categoryServiceSpy.deleteCategory).toHaveBeenCalledWith(1, 1);
    expect(component.categories.length).toBe(0);
  });
});
