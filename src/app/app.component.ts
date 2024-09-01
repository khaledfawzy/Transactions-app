import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { TranslatePipe } from './shared/translation.pipe'; // استيراد TranslatePipe من الملف الصحيح
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent, TranslatePipe], // تأكد من تضمين جميع الاستيرادات المطلوبة
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
