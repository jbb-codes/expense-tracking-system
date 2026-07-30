import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { SearchCategoriesComponent } from './search-categories.component';
import { CategoryService } from '../category.service';
import { AuthService } from '../../auth/auth.service';

describe('SearchCategoriesComponent', () => {
  let component: SearchCategoriesComponent;
  let fixture: ComponentFixture<SearchCategoriesComponent>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockCategories = [
    {
      _id: '1',
      userId: 1000,
      categoryId: 1,
      name: 'Food',
      description: 'Groceries and dining',
    },
  ];

  beforeEach(async () => {
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'searchCategories',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);
    authServiceSpy.getUserId.and.returnValue(1000);

    await TestBed.configureTestingModule({
      imports: [SearchCategoriesComponent],
      providers: [
        provideRouter([]),
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Confirm the search term and logged-in userId reach the service, and results populate on success
  it('should call searchCategories with the logged-in userId and form name on search', () => {
    categoryServiceSpy.searchCategories.and.returnValue(of(mockCategories));

    component.searchForm.setValue({ name: 'food' });
    component.onSearch();

    expect(categoryServiceSpy.searchCategories).toHaveBeenCalledWith(
      1000,
      'food',
    );
    expect(component.categories).toEqual(mockCategories);
    expect(component.errorMessage).toBe('');
  });

  // Guard against a failed search leaving stale or partial data on screen
  it('should set an error message and clear categories when the search fails', () => {
    categoryServiceSpy.searchCategories.and.returnValue(
      throwError(() => new Error('Network error')),
    );

    component.searchForm.setValue({ name: 'food' });
    component.onSearch();

    expect(component.errorMessage).toBe('Error searching categories.');
    expect(component.categories).toEqual([]);
  });

  // Guard against a confusing blank table when a search legitimately matches nothing
  it('should show an empty-state message when the search returns no results', () => {
    categoryServiceSpy.searchCategories.and.returnValue(of([]));

    component.searchForm.setValue({ name: 'nonexistent' });
    component.onSearch();
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.results-meta')).toBeNull();
  });
});
