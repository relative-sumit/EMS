import { HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptorInterceptor: HttpInterceptorFn = (
  req,
  next: HttpHandlerFn
) => {
  return next(req).pipe(
    catchError((error) => {
      console.error('Caught in ErrorInterceptor', error.message);

      return throwError(() => error);
    })
  );
};
