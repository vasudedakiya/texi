import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('userId'); // Check if userId is stored

    if (!isLoggedIn) {
      this.router.navigate(['dashboard']); // Redirect to dashboard if not logged in
      return false;
    }
    return true; // Allow access
  }
}
