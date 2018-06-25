import { NotificationService } from './../../services/notification.service';
import { NgProgress } from 'ngx-progressbar';
import { StaticFunc } from './../../function-usages/static.func';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  clearUserInterval: any;
  clearNotificationInterval: any;
  user: Object  = {};
  notifications: Object = {};

  constructor(
    public progress: NgProgress,
    private router: Router,
    private logoutService: UserService,
    private coolDialogs: NgxCoolDialogsService,
    private notificationService: NotificationService
  ) {
    this.user = JSON.parse(localStorage.getItem('lt_token'))['data'];
    if (StaticFunc.userMst(this.user['user_pms'])) {
      this.notificationService.getMstNotifications().subscribe((notifications) => {
        this.notifications['length'] = notifications.json()['length'];
        this.notifications['data'] = notifications.json()['data'];
          console.log(this.notifications);
      }, (error) => { });
    } else {
      this.notificationService.getUsrNotifications().subscribe((notifications) => {
        this.notifications = notifications.json()['data'];
          console.log(this.notifications);
      }, (error) => {});
    }
    this.clearUserInterval = setInterval(() => {
      this.user = JSON.parse(localStorage.getItem('lt_token'))['data'];
    }, 3000);

    this.clearNotificationInterval = setInterval(() => {
      if (StaticFunc.userMst(this.user['user_pms'])) {
        this.notificationService.getMstNotifications().subscribe((notifications) => {
          this.notifications['length'] = notifications.json()['length'];
          this.notifications['data'] = notifications.json()['data'];
        }, (error) => {console.log(error); });
      } else {
        this.notificationService.getUsrNotifications().subscribe((notifications) => {
          this.notifications['length'] = notifications.json()['length'];
          this.notifications['data'] = notifications.json()['data'];
        }, (error) => {});
      }
    }, 10000);
  }

  ngOnInit() {
  }

  navigateToProfile(userid: String) {
    this.router.navigate(['/dashboard', 'profile', userid]);
  }

  getImage(imageUrl) {
    if (navigator.onLine) {
      return imageUrl;
    }
    return 'assets/img/ic_user.jpg';
  }

  doLogout() {
    this.progress.start();
    this.logoutService.logoutUser().subscribe((success) => {
      clearInterval(this.clearUserInterval);
      clearInterval(this.clearNotificationInterval);
      localStorage.removeItem('lt_token');
      this.router.navigate(['/login']);
      this.progress.done();
    }, (error) => {
      if (error.status === 405) {
        this.coolDialogs.alert(error.json()['message'], {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Warning'
        }).subscribe((res) => {
          localStorage.clear();
          this.router.navigate(['/login']);
        });
      } else {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
      this.progress.done();
    });
  }

  en_user_id(id: string) {
    return StaticFunc.en_normal(id);
  }

  checkUserPMS() {
    return StaticFunc.userMst(this.user['user_pms']);
  }

  userPMS() {
    return StaticFunc.userPMS(this.user['user_pms']);
  }

}
