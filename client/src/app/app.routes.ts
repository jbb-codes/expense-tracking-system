/**
 * Author: Amanda Ruff
 * Week 6 - Sprint 1
 * Modified: Jarren Bess, 7/7/2026
 * File: app.routes.ts
 * Description: Application routes
 *
 * Changes (Jarren Bess, 7/7/2026):
 * - Added the list-expenses route.
 */

import { Routes } from '@angular/router';
import { StyleTestComponent } from './style-test/style-test.component';
import { CreateExpenseComponent } from './expenses/create-expense/create-expense.component';
import { ListExpensesComponent } from './expenses/list-expenses/list-expenses.component';
import { ReadExpenseByIdComponent } from './expenses/read-expense-by-id/read-expense-by-id.component';

export const routes: Routes = [
  { path: 'create-expense', component: CreateExpenseComponent },
  { path: 'list-expenses', component: ListExpensesComponent },
  { path: 'read-expense-by-id', component: ReadExpenseByIdComponent },
  { path: 'style-test', component: StyleTestComponent }, // not included in app.routes.ts
];
