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
        this.transactions = data;
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
/* 
  getPhotoUrl(emp_code: string): string {
    return emp_code ? `assets/images/${emp_code}` : 'assets/images/no-userimage.jpg';
  } */

    /* getPhotoUrl(photoFilename: string): string {
      if (photoFilename && photoFilename.trim() !== '') {
        // Construct URL for employee photo
        return `assets/images/${photoFilename}`;
      } else {
        // Fallback to common image if photoFilename is empty or not provided
        return 'assets/images/noimage.gif';
      }
    } */


 /*  getPhotoUrl(photoFilename: string): string {

    const url= photoFilename ? `assets/images/${photoFilename}` : 'assets/images/noimage.gif';
    console.log('Generated Photo URL:', url);  
    return url;
  } */

    getPhotoUrl(empCode: string): string {
      // Construct the filename from empCode and return the correct URL
      const photoFilename = empCode ? `${empCode}.jpg` : 'noimage.gif';
      const url = `assets/images/${photoFilename}`;
      console.log('Generated Photo URL:', url);  // Log the URL for debugging
      return url;
    }
}
