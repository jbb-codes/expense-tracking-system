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
 */

import { Routes } from '@angular/router';
import { CreateExpenseComponent } from './expenses/create-expense/create-expense.component';
import { ListExpensesComponent } from './expenses/list-expenses/list-expenses.component';
import { ReadExpenseByIdComponent } from './expenses/read-expense-by-id/read-expense-by-id.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { UpdateExpenseComponent } from './expenses/update-expense/update-expense.component';

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
  { path: 'create-expense', component: CreateExpenseComponent, canActivate: [AuthGuard] },

  // Protected page that displays all expenses.
  { path: 'list-expenses', component: ListExpensesComponent, canActivate: [AuthGuard] },

  /**
   * Amanda Ruff
   * Week 7 - Sprint 2
   * Route for updating an existing expense.
   * Users must be authenticated before accessing this page.
   */
  { path: 'update-expense', component: UpdateExpenseComponent, canActivate: [AuthGuard] },

  // Protected page used to view a single expense by its ID.
  { path: 'read-expense-by-id', component: ReadExpenseByIdComponent, canActivate: [AuthGuard] }
];
