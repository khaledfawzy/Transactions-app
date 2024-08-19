// src/app/app.routes.ts

import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Assuming HomeComponent is created
import { TransactionComponent } from './transaction/transaction.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent }, // Define HomeComponent if necessary
  { path: 'transactions', component: TransactionComponent }
];
