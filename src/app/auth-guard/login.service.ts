import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class LoginService implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate() {
    if (!localStorage.getItem('lt_token')) {
      return true;
    }
    this.router.navigate(['/dashboard']);
    return false;
  }

}
