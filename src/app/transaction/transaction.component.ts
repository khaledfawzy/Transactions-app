import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Add FormsModule here
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
        // Process transactions to group by employee and date
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
    // Construct the filename from empCode and return the correct URL
    const photoFilename = empCode ? `${empCode}.jpg` : 'noimage.gif';
    const url = `assets/images/${photoFilename}`;
    console.log('Generated Photo URL:', url);  // Log the URL for debugging
    return url;
  }

  // Group transactions by emp_code and tr_date, and determine in_time and out_time
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
          in_time: transaction.punch_time,
          out_time: transaction.punch_time,
        });
      } else {
        const existingTransaction = transactionMap.get(key);
        if (transaction.punch_time < existingTransaction.in_time) {
          existingTransaction.in_time = transaction.punch_time;
        }
        if (transaction.punch_time > existingTransaction.out_time) {
          existingTransaction.out_time = transaction.punch_time;
        }
      }
    });

    transactionMap.forEach(value => {
      if (value.in_time === value.out_time) {
        value.out_time = '00:00:00'; // If there's no out time, set it to '00:00:00'
      }
      groupedTransactions.push(value);
    });

    return groupedTransactions;
  }
}
