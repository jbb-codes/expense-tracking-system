/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * Modified: Jarren Bess, 7/7/2026
 * File: app.routes.ts
 * Description: Application routes
 *
 * Changes (Jarren Bess, 7/7/2026):
 * - Added the list-expenses route.
 *
 * Changes (Kaitlyn Kelly, 7/10/26):
 * - Added login route
 * - Added AuthGuard to all protected routes
 */

import { Routes } from '@angular/router';
import { CreateExpenseComponent } from './expenses/create-expense/create-expense.component';
import { ListExpensesComponent } from './expenses/list-expenses/list-expenses.component';
import { ReadExpenseByIdComponent } from './expenses/read-expense-by-id/read-expense-by-id.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'create-expense', component: CreateExpenseComponent, canActivate: [AuthGuard] },
  { path: 'list-expenses', component: ListExpensesComponent, canActivate: [AuthGuard] },
  { path: 'read-expense-by-id', component: ReadExpenseByIdComponent, canActivate: [AuthGuard] }
];
