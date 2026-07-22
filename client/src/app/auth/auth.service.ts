/**
 * Author: Kaitlyn Kelly
 * Date: 7/10/26
 * File: auth.service.ts
 * Description: Angular service responsible for managing app's authentication state.
 * - Stores and retrieves user authentication data
 * - Allows AuthGuard and other components to determine if someone is logged in
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // Stores the authenticated user's info to stay logged in after redirect or refresh
  login(userId: number, username: string): void {
    localStorage.setItem('userId', String(userId));
    localStorage.setItem('username', username);
  }

  // Clears the server-side session and the locally cached authentication state
  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
      error: (error: unknown) => {
        console.error('Failed to end server session during logout', error);
      },
    });
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('userId');
  }

  getUserId(): number {
    return Number(localStorage.getItem('userId'));
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}
