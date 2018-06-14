import { NgProgress } from 'ngx-progressbar';
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
    public progress: NgProgress,
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
    this.progress.start();
    this.subscription = this.logoutService.logoutUser().subscribe((success) => {
      localStorage.removeItem('lt_token');
      this.router.navigate(['/login']);
      this.subscription.unsubscribe();
      this.progress.done();
    }, (error) => {
      if (error.status === 405) {
        const alertSubscription: Subscription = this.coolDialogs.alert(error.json()['message'], {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Warning'
        }).subscribe((res) => {
          localStorage.clear();
          this.router.navigate(['/login']);
          alertSubscription.unsubscribe();
        });
      } else {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
      this.subscription.unsubscribe();
      this.progress.done();
    });
  }

  en_user_id(id: string) {
    return StaticFunc.en_normal(id);
  }

  userPMS() {
    return StaticFunc.userPMS(this.user['user_pms']);
  }

}
