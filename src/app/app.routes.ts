import { Routes } from '@angular/router';
import { ListTasks } from './ListTasks/ListTasks';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'all',
    pathMatch: 'full',
  },
  {
    path: ':filter',
    component: ListTasks,
  },
  {
    path: '*',
    redirectTo: 'all',
  },
];
