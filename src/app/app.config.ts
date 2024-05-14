import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { GlobalErrorHandler } from '../global-error-handler';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptorInterceptor } from './interceptor/error-interceptor.interceptor';
import { graphqlProvider } from './graphql.provider';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptorInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }, provideHttpClient(), graphqlProvider, provideAnimationsAsync(), provideAnimationsAsync(),
  ],
};
