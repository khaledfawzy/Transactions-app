import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailComponent } from '../email/email.component'; // Import EmailComponent

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EmailComponent // Include EmailComponent
  ],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  transactions: any[] = [];
  selectedDate: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.selectedDate = this.getTodayDate();
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    const url = this.selectedDate
      ? `http://195.100.100.80:3000/api/transactions?date=${this.selectedDate}`
      : 'http://195.100.100.80:3000/api/transactions';

    this.http.get<any[]>(url).subscribe({
      next: data => {
        console.log('Fetched transactions:', data); // Log data for debugging
        this.transactions = this.groupTransactions(data);
      },
      error: err => {
        console.error('Error fetching transactions:', err);
      }
    });
  }

  onDateChange(): void {
    this.fetchTransactions();
  }

  private getTodayDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  getPhotoUrl(empCode: string): string {
    const photoFilename = empCode ? `${empCode}.jpg` : 'noimage.gif';
    const url = `assets/images/${photoFilename}`;
    return url;
  }

  private groupTransactions(data: any[]): any[] {
    const groupedTransactions: any[] = [];
    const transactionMap = new Map<string, any>();

    data.forEach(transaction => {
      const key = `${transaction.emp_code}-${transaction.tr_date}`;

      if (!transactionMap.has(key)) {
        transactionMap.set(key, {
          emp_code: transaction.emp_code,
          tr_date: transaction.tr_date,
          first_name: transaction.first_name,
          nickname: transaction.nickname,
          in_time: transaction.in_time.substring(0, 8), // Only show HH:MM:SS
          out_time: transaction.out_time.substring(0, 8), // Only show HH:MM:SS
          email: transaction.email // Add email to the transaction
        });
      } else {
        const existingTransaction = transactionMap.get(key);

        if (transaction.punch_time < existingTransaction.in_time) {
          existingTransaction.in_time = transaction.punch_time.substring(0, 8);
        }
        if (transaction.punch_time > existingTransaction.out_time) {
          existingTransaction.out_time = transaction.punch_time.substring(0, 8);
        }
      }
    });

    transactionMap.forEach(value => {
      if (value.in_time === value.out_time) {
        value.out_time = '00:00:00';
      }
      groupedTransactions.push(value);
    });

    console.log('Grouped transactions:', groupedTransactions); // Log grouped transactions for debugging

    return groupedTransactions;
  }
}
