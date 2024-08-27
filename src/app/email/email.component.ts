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

  constructor(private http: HttpClient) {}

  sendEmail(): void {
    const emailBody = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              margin: 0;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              display: flex;
              align-items: center;
              margin-bottom: 20px;
            }
            .header img {
              max-height: 50px;
              margin-right: 20px;
            }
            .header h1 {
              font-size: 24px;
              margin: 0;
            }
            .content {
              font-size: 16px;
              line-height: 1.5;
            }
            .footer {
              margin-top: 20px;
              font-size: 14px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://example.com/path-to-your-logo.png" alt="Company Logo"> <!-- Replace with your logo URL -->
              <h1>Osoul Investment CO.</h1>
            </div>
            <div class="content">
              <p>Dear ${this.transaction.first_name},</p>
              <p>Here are your transaction details for ${this.transaction.tr_date}:</p>
              <ul>
                <li><strong>In Time:</strong> ${this.transaction.in_time}</li>
                <li><strong>Out Time:</strong> ${this.transaction.out_time}</li>
                <li><strong>Late:</strong> ${this.calculateLate(this.transaction.in_time)}</li>
              </ul>
              <p>Best regards,<br>HR Department</p>
            </div>
            <div class="footer">
              <p>Osoul Investment CO. | Address | Contact Information</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailRequest = {
      to: this.transaction.email,
      subject: `Your Transaction Details for ${this.transaction.tr_date}`,
      html: emailBody
    };

    this.http.post('http://195.100.100.80:3000/api/send-email', emailRequest).subscribe({
      next: (response: any) => {
        if (response?.message === 'Email sent successfully!') {
          alert('Email sent successfully!');
        } else {
          alert('Failed to send email.');
        }
      },
      error: err => {
        console.error('Error sending email:', err);
        alert('Failed to send email.');
      }
    });
  }

  private calculateLate(inTime: string): string {
    const standardTime = '08:30:00'; // Standard in-time (e.g., 08:30 AM)
    const standardTimeDate = new Date(`1970-01-01T${standardTime}Z`);
    const inTimeDate = new Date(`1970-01-01T${inTime}Z`);
    const lateMilliseconds = inTimeDate.getTime() - standardTimeDate.getTime();

    if (lateMilliseconds <= 0) {
      return 'On Time';
    }

    const lateHours = Math.floor(lateMilliseconds / (1000 * 60 * 60));
    const lateMinutes = Math.floor((lateMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    return `${lateHours}h ${lateMinutes}m Late`;
  }
}
