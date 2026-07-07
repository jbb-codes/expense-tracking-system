import { Routes } from '@angular/router';
import { CreateExpenseComponent } from './expenses/create-expense/create-expense.component';

export const routes: Routes = [
  { path: 'create-expense', component: CreateExpenseComponent },
  { path: '', redirectTo: 'create-expense', pathMatch: 'full' }
];
