/**
 * Author: Kaitlyn Kelly
 * Date: 7/10/26
 * File: auth.service.ts
 * Description: Angular service responsible for managing app's authentication state.
 * - Stores and retrieves user authentication data
 * - Allows AuthGuard and other components to determine if someone is logged in
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Stores the authenticated user's info to stay logged in after redirect or refresh
  login(userId: number, username: string): void {
    localStorage.setItem('userId', String(userId));
    localStorage.setItem('username', username);
  }


  // Will clear all authenticated data when a logout option is added
  logout(): void {
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
