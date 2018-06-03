import { UserService } from './../services/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class RegisterService implements CanActivate {

  constructor(
    private registerService: UserService,
    private router: Router
  ) { }

  canActivate() {
    if (localStorage.getItem('lti_exist')) {
      const check: any = localStorage.getItem('lti_exist');
      if (check === 'true') {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    } else {
      this.registerService.getLength().subscribe((data) => {
        if (data.status === 204) {
          localStorage.setItem('lti_exist', 'false');
          this.router.navigate(['/register']);
        } else {
          localStorage.setItem('lti_exist', 'true');
          this.router.navigate(['/login']);
        }
      }, (error) => {
        localStorage.setItem('lti_exist', 'true');
        this.router.navigate(['/login']);
      });
    }
  }
}
