import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHandlerFn, HttpInterceptorFn, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // هنا يمكنك إضافة منطق لعرض/إخفاء التحميل
    console.log('Request started');

    return next.handle(req).pipe(
      tap(event => {
        if (event.type === HttpEventType.Response) {
          console.log('Request completed');
        }
      })
    );
  }
}

// تحويل `LoadingInterceptor` إلى دالة يمكن استخدامها مع `provideHttpClient`
export function loadingInterceptor(): HttpInterceptorFn {
  return (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    console.log('Request started');

    return next(req).pipe(
      tap(event => {
        if (event.type === HttpEventType.Response) {
          console.log('Request completed');
        }
      })
    );
  };
}
