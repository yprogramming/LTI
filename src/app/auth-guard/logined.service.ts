import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginedService implements CanActivate {
  constructor(
    private router: Router
  ) { }

  canActivate() {
    if (localStorage.getItem('lt_token')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
