import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-email',
  standalone: true,
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent {
  @Input() transaction: any;
  private logoUrl: string = 'http://localhost:3000/assets/images/company-logo.png';
  constructor(private http: HttpClient) {}

  sendEmail(): void {
    const emailBody = `
      <div style="font-family: Arial, sans-serif; color: #333;">
      <img src="${this.logoUrl}" alt="Company Logo" style="width: 50px; height: 50px; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.5);" />
        <h3>Osoul Investment CO.</h3>
        <p><strong>Attendanc Daily Report - تقرير اليومى للبصمة</strong></p>
        <p>Date: ${this.transaction.tr_date}</p>
        <p>Dear ${this.transaction.first_name},</p>
        <p>Here are your transaction details:</p>
        <ul>
          <li><strong>In Time:</strong> ${this.transaction.in_time}</li>
          <li><strong>Out Time:</strong> ${this.transaction.out_time}</li>
          <li><strong>Late:</strong> ${this.transaction.late}</li>
          <li><strong>Total Duration:</strong> ${this.transaction.totalDuration}</li>
        </ul>
        <p>Best regards,</p>
        <p>HR Department</p>
      </div>
    `;

    const emailRequest = {
      to: this.transaction.email,
      subject: `Your Attendance Details for ${this.transaction.tr_date}`,
      html: emailBody
    };

    this.http.post('http://195.100.100.80:3000/api/send-email', emailRequest).subscribe({
      next: (response: any) => {
        alert('Email sent successfully!');
      },
      error: err => {
        console.error('Error sending email:', err);
        alert('Failed to send email.');
      }
    });
  }
}
