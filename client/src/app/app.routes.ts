/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * Modified: Jarren Bess, 7/7/2026
 * Modified: Kaitlyn Kelly, 7/10/2026
 * Modified: Amanda Ruff, 7/12/2026
 * File: app.routes.ts
 * Description: Application routes.
 *
 * Changes (Jarren Bess, 7/7/2026):
 * - Added the List Expenses route.
 *
 * Changes (Kaitlyn Kelly, 7/10/2026):
 * - Added the Login route.
 * - Added AuthGuard to all protected routes.
 *
 * Changes (Amanda Ruff, 7/12/2026):
 * - Added the Update Expense component route.
 * - Protected the Update Expense page using AuthGuard.
 *
 * Changes (Kaitlyn Kelly, 7/14/2026):
 * - Added Delete Expense component route with AuthGuard.
 *
 * Changes (Kaitlyn Kelly, 7/16/2026):
 * - Added HomeComponent route with AuthGuard
 *
 * Changes (Jarren Bess, 7/20/2026):
 * - Added the List Categories route.
 *
 * Changes (Kaitlyn Kelly, 7/20/2026):
 * - Added ReadCategoryByIdComponent route with AuthGuard
 */

import { Routes } from '@angular/router';
import { CreateExpenseComponent } from './expenses/create-expense/create-expense.component';
import { ListExpensesComponent } from './expenses/list-expenses/list-expenses.component';
import { ReadExpenseByIdComponent } from './expenses/read-expense-by-id/read-expense-by-id.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { UpdateExpenseComponent } from './expenses/update-expense/update-expense.component';
import { SearchExpensesComponent } from './expenses/search-expenses/search-expenses.component';
import { DeleteExpenseComponent } from './expenses/delete-expense/delete-expense.component';
import { HomeComponent } from './home/home.component';
import { ListCategoriesComponent } from './categories/list-categories/list-categories.component';
import { ReadCategoryByIdComponent } from './expenses/read-category-by-id/read-category-by-id.component';

/**
 * Amanda Ruff
 * Week 7 - Sprint 2
 * Defines the application navigation routes.
 * Protected routes require users to be authenticated before access is granted.
 */
export const routes: Routes = [
  // Redirect the application to the login page when no route is provided.
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public login page.
  { path: 'login', component: LoginComponent },

  // Protected page used to create a new expense.
  {
    path: 'create-expense',
    component: CreateExpenseComponent,
    canActivate: [AuthGuard],
  },

  // Protected page that displays all expenses.
  {
    path: 'list-expenses',
    component: ListExpensesComponent,
    canActivate: [AuthGuard],
  },

  /**
   * Amanda Ruff
   * Week 7 - Sprint 2
   * Route for updating an existing expense.
   * Users must be authenticated before accessing this page.
   */
  {
    path: 'update-expense',
    component: UpdateExpenseComponent,
    canActivate: [AuthGuard],
  },

  // Protected page used to view a single expense by its ID.
  {
    path: 'read-expense-by-id',
    component: ReadExpenseByIdComponent,
    canActivate: [AuthGuard],
  },

  // Protected page used to search a user's expenses by description.
  {
    path: 'search-expenses',
    component: SearchExpensesComponent,
    canActivate: [AuthGuard],
  },

  // Protected page used to delete an expense
  {
    path: 'delete-expense',
    component: DeleteExpenseComponent,
    canActivate: [AuthGuard],
  },

  // Protected page used as a landing page after login
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },

  // Protected page that displays all categories.
  {
    path: 'list-categories',
    component: ListCategoriesComponent,
    canActivate: [AuthGuard],
  },

  // Protected page used to read category by ID
  {
    path: 'read-category-by-id',
    component: ReadCategoryByIdComponent,
    canActivate: [AuthGuard],
  },
];
