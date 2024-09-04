import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://195.100.100.80:3000/api/send-email'; // Adjust URL as needed

  constructor(private http: HttpClient) {}

  sendEmail(transaction: any): Observable<any> {
    const emailBody = this.createEmailBody(transaction);
    const emailRequest = {
      to: transaction.email,
      subject: `Your Attendance Details for ${transaction.tr_date}`,
      html: emailBody
    };
    return this.http.post<any>(this.apiUrl, emailRequest);
  }

  sendMonthlySummary(transactions: any[]): Observable<any> {
    if (transactions.length === 0) {
      throw new Error('No transactions available to send.');
    }
    
    const emailBody = this.createMonthlySummaryBody(transactions);
    const emailRequest = {
      to: transactions[0].email, // Assumes all transactions are for the same employee
      subject: `Your Attendance Summary for the Current Month`,
      html: emailBody
    };
    return this.http.post<any>(this.apiUrl, emailRequest);
  }

  private createEmailBody(transaction: any): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h3>Osoul Investment CO.</h3>
        <p><strong>Attendance Daily Report</strong></p>
        <p>Date: ${transaction.tr_date}</p>
        <p>Dear ${transaction.first_name},</p>
        <p>Here are your transaction details:</p>
        <ul>
          <li><strong>In Time:</strong> ${transaction.in_time}</li>
          <li><strong>Out Time:</strong> ${transaction.out_time}</li>
          <li><strong>Late:</strong> ${transaction.late}</li>
          <li><strong>Total Duration:</strong> ${transaction.totalDuration}</li>
        </ul>
        <p>Best regards,</p>
        <p>HR Department</p>
      </div>
    `;
  }

  private createMonthlySummaryBody(transactions: any[]): string {
    const employeeName = transactions[0].first_name; // Assuming all transactions are for the same employee

    return `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h3>Osoul Investment CO.</h3>
        <p><strong>Attendance Monthly Report</strong></p>
        <p>Dear ${employeeName},</p>
        <p>Here are your transaction details for the current month:</p>
        <ul>
          ${transactions.map(transaction => `
            <li>
              <p>Date: ${transaction.tr_date}</p>
              <p>In Time: ${transaction.in_time}</p>
              <p>Out Time: ${transaction.out_time}</p>
              <p>Late: ${transaction.late}</p>
              <p>Status: ${transaction.status}</p>
            </li>
          `).join('')}
        </ul>
        <p>Best regards,</p>
        <p>HR Department</p>
      </div>
    `;
  }
}
