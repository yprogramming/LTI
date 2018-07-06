import { StaticFunc } from './../function-usages/static.func';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class NotificationGaurd implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate() {
    if (this.checkUserPms()) {
      return true;
    }
    this.router.navigate(['/dashboard', 'notification']);
    return false;
  }

  checkUserPms() {
    const user = JSON.parse(localStorage.getItem('lt_token'))['data'];
    if (
      (user['user_pms'] === StaticFunc.en_fixed_string('admin'))
                                      ||
      (user['user_pms'] === StaticFunc.en_fixed_string('user'))
    ) {
      return true;
    }
    return false;
  }
}
