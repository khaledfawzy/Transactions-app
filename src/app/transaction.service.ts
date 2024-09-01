// src/app/transaction.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from './models/transaction.model';



@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://195.100.100.80:3000/api/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(date: string = ''): Observable<Transaction[]> {
    const url = date ? `${this.apiUrl}?date=${date}` : this.apiUrl;
    return this.http.get<Transaction[]>(url);
  }
}
