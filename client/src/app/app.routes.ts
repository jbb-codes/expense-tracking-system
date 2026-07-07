import { Routes } from '@angular/router';
import { StyleTestComponent } from './style-test/style-test.component';
import { CreateExpenseComponent } from './expenses/create-expense/create-expense.component';

export const routes: Routes = [
  { path: 'create-expense', component: CreateExpenseComponent },
  { path: 'style-test', component: StyleTestComponent }
];
