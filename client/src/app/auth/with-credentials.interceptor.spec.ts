/**
 * File: with-credentials.interceptor.spec.ts
 * Description: Unit tests confirming outgoing HttpClient requests carry
 * credentials, so the session cookie set by the server is sent back.
 */

import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { withCredentialsInterceptor } from './with-credentials.interceptor';

describe('withCredentialsInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([withCredentialsInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('marks outgoing requests as withCredentials so the session cookie is sent', () => {
    http.get('/api/expenses?userId=1000').subscribe();

    const req = httpMock.expectOne('/api/expenses?userId=1000');
    expect(req.request.withCredentials).toBe(true);
    req.flush([]);
  });
});
