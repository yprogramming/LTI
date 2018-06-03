import { StaticFunc } from './../../function-usages/static.func';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  subscription: Subscription;
  user: Object;
  constructor(
    private router: Router,
    private logoutService: UserService,
    private coolDialogs: NgxCoolDialogsService
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('lt_token'))['data'];
  }

  navigateToProfile(userid: String) {
    this.router.navigate(['/dashboard', 'profile', userid]);
  }

  doLogout() {
    this.subscription = this.logoutService.logoutUser().subscribe((success) => {
      localStorage.removeItem('lt_token');
      this.router.navigate(['/login']);
      this.subscription.unsubscribe();
    }, (error) => {
      if (error.status === 410) {
        const alertSubscription: Subscription = this.coolDialogs.alert(error.json()['message'], {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Error'
        }).subscribe((res) => {
          localStorage.removeItem('lt_token');
          this.router.navigate(['/login']);
          alertSubscription.unsubscribe();
        });
      } else {
        localStorage.removeItem('lt_token');
        this.router.navigate(['/login']);
      }
      this.subscription.unsubscribe();
    });
  }

  en_user_id(id: string) {
    return StaticFunc.en_normal(id);
  }

}
