import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailComponent } from '../email/email.component';
import { formatDate } from '@angular/common';
import { TranslatePipe } from "../shared/translation.pipe.spec"; // Import Angular's formatDate utility

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EmailComponent,
    TranslatePipe
],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  transactions: any[] = [];
  selectedDate: string = '';
  isArabic: boolean = false; // Add this property to track the language mode

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
        console.log('Fetched transactions:', data);
        this.transactions = this.processTransactions(data);
      },
      error: err => {
        console.error('Error fetching transactions:', err);
      }
    });
  }

  onDateChange(): void {
    this.fetchTransactions();
  }

  toggleDirection(): void {
    this.isArabic = !this.isArabic; // Toggle between English and Arabic modes
  }

  private getTodayDate(): string {
    const today = new Date();
    return formatDate(today, 'yyyy-MM-dd', 'en-US'); // Use Angular's formatDate
  }

  private processTransactions(data: any[]): any[] {
    const processedTransactions: any[] = data.map(transaction => {
      const inTime = this.parseTime(transaction.in_time);
      const outTime = this.parseTime(transaction.out_time);
      const expectedInTime = this.parseTime("08:30:00"); // Assuming 8:30 AM is the expected start time

      const late = inTime > expectedInTime ? this.calculateDuration(expectedInTime, inTime) : '00:00:00';
      const totalDuration = inTime && outTime ? this.calculateDuration(inTime, outTime) : '00:00:00';
      const status = late > '00:00:00' ? 'Late' : 'On Time';

      return {
        ...transaction,
        tr_date: formatDate(transaction.tr_date, 'yyyy-MM-dd', 'en-US'), // Format the transaction date
        late,
        status
      };
    });

    console.log('Processed transactions:', processedTransactions);
    return processedTransactions;
  }

  private parseTime(timeString: string): Date {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }

  private calculateDuration(start: Date, end: Date): string {
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}
