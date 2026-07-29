/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * File: app.routes.ts
 * Description: Defines the application's public and protected routes.
 *
 * Changes (Jarren Bess, 7/20/2026):
 * - Added the List Categories route.
 *
 * Changes (Kaitlyn Kelly, 7/20/2026):
 * - Added the Read Category by ID route with AuthGuard.
 *
 * Changes (Amanda Ruff, 7/20/2026):
 * - Added the protected Create Category route.
 *
 * Changes (Kaitlyn Kelly, 7/27/2026):
 * - Added the protected Delete Category route.
 *
 * Changes (Amanda Ruff, 7/27/2026):
 * - Added the protected Update Category route for Sprint 4.
 * - Corrected the closing structure of the Create Category route.
 */

import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { CreateCategoryComponent } from './categories/create-category/create-category.component';
import { DeleteCategoryComponent } from './categories/delete-category/delete-category.component';
import { ListCategoriesComponent } from './categories/list-categories/list-categories.component';
import { ReadCategoryByIdComponent } from './categories/read-category-by-id/read-category-by-id.component';
import { UpdateCategoryComponent } from './categories/update-category/update-category.component';
import { SearchCategoriesComponent } from './categories/search-categories/search-categories.component';
import { CreateExpenseComponent } from './expenses/create-expense/create-expense.component';
import { DeleteExpenseComponent } from './expenses/delete-expense/delete-expense.component';
import { ListExpensesComponent } from './expenses/list-expenses/list-expenses.component';
import { ReadExpenseByIdComponent } from './expenses/read-expense-by-id/read-expense-by-id.component';
import { SearchExpensesComponent } from './expenses/search-expenses/search-expenses.component';
import { UpdateExpenseComponent } from './expenses/update-expense/update-expense.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';

/**
 * Defines the application navigation routes.
 *
 * Routes containing AuthGuard require the user to be
 * authenticated before access is granted.
 */
export const routes: Routes = [
  /**
   * Public landing page shown at the application root.
   */
  {
    path: '',
    component: LandingComponent,
  },

  /**
   * Public login page.
   */
  {
    path: 'login',
    component: LoginComponent,
  },

  /**
   * Protected dashboard shown after login.
   */
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },

  /**
   * Amanda Ruff
   * Week 6 - Sprint 1
   *
   * Protected page used to create a new expense.
   */
  {
    path: 'create-expense',
    component: CreateExpenseComponent,
    canActivate: [AuthGuard],
  },

  /**
   * Jarren Bess
   * Week 6 - Sprint 1
   *
   * Protected page that displays all expenses.
   */
  {
    path: 'list-expenses',
    component: ListExpensesComponent,
    canActivate: [AuthGuard],
  },

  /**
   * Amanda Ruff
   * Week 7 - Sprint 2
   *
   * Protected page used to update an existing expense.
   */
  {
    path: 'update-expense',
    component: UpdateExpenseComponent,
    canActivate: [AuthGuard],
  },

  /**
   * Protected page used to read a single expense by ID.
   */
  {
    path: 'read-expense-by-id',
    component: ReadExpenseByIdComponent,
    canActivate: [AuthGuard],
  },

  /**
   * Protected page used to search expenses by description.
   */
  {
    path: 'search-expenses',
    component: SearchExpensesComponent,
    canActivate: [AuthGuard],
  },

  /**
   * Protected page used to delete an expense.
   */
  {
    path: 'delete-expense',
    component: DeleteExpenseComponent,
    canActivate: [AuthGuard],
  },

  /**
   * Jarren Bess
   * Week 8 - Sprint 3
   *
   * Protected page that displays all categories.
   */
  {
    path: 'list-categories',
    component: ListCategoriesComponent,
    canActivate: [AuthGuard],
  },

  /**
   * Kaitlyn Kelly
   * Week 8 - Sprint 3
   *
   * Protected page used to read a category by ID.
   */
  {
    path: 'read-category-by-id',
    component: ReadCategoryByIdComponent,
    canActivate: [AuthGuard],
  },

  /**
   * Amanda Ruff
   * Week 8 - Sprint 3
   *
   * Protected page used to create a category.
   */
  {
    path: 'create-category',
    component: CreateCategoryComponent,
    canActivate: [AuthGuard],
  },

  /**
   * Amanda Ruff
   * Week 9 - Sprint 4
   *
   * Protected page used to select and update
   * an existing category.
   */
  {
    path: 'update-category',
    component: UpdateCategoryComponent,
    canActivate: [AuthGuard],
  },

  /**
   * Kaitlyn Kelly
   * Week 9 - Sprint 4
   *
   * Protected page used to delete a category.
   */
  {
    path: 'delete-category',
    component: DeleteCategoryComponent,
    canActivate: [AuthGuard],
  },

  /**
   * Jarren Bess
   *
   * Protected page used to search categories by name or description.
   */
  {
    path: 'search-categories',
    component: SearchCategoriesComponent,
    canActivate: [AuthGuard],
  },
];
