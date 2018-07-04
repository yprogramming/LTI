import { NotificationService } from './../../services/notification.service';
import { NgProgress } from 'ngx-progressbar';
import { StaticFunc } from './../../function-usages/static.func';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { UserService } from './../../services/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  user: Object  = {};
  notifications: Object = {};

  constructor(
    public progress: NgProgress,
    private router: Router,
    private logoutService: UserService,
    private coolDialogs: NgxCoolDialogsService,
    private notificationService: NotificationService
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if (localStorage.getItem('lt_token')) {
          this.user = JSON.parse(localStorage.getItem('lt_token'))['data'];
          if (StaticFunc.userMst(this.user['user_pms'])) {
            const subscript: Subscription = this.notificationService.getMstNotifications().subscribe((notifications) => {
              this.notifications['length'] = notifications.json()['length'];
              this.notifications['data'] = notifications.json()['data'];
              subscript.unsubscribe();
            }, (error) => {
              subscript.unsubscribe();
            });
          } else {
            const subscript: Subscription = this.notificationService.getUsrNotifications().subscribe((notifications) => {
              this.notifications['length'] = notifications.json()['length'];
              this.notifications['data'] = notifications.json()['data'];
              subscript.unsubscribe();
            }, (error) => {
              subscript.unsubscribe();
            });
          }
        }
      }
    });
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

  viewedNotification(notification_id: string) {
    const subscript: Subscription = this.notificationService.viewedNotification(notification_id).subscribe((res) => {
      subscript.unsubscribe();
    }, (error) => {
      subscript.unsubscribe();
    });
  }

  doLogout() {
    this.progress.start();
    const logoutSubscription: Subscription = this.logoutService.logoutUser().subscribe((success) => {
      localStorage.removeItem('lt_token');
      this.router.navigate(['/login']);
      this.progress.done();
      logoutSubscription.unsubscribe();
    }, (error) => {
      if (error.status === 405) {
        const dialogSubscript: Subscription = this.coolDialogs.alert(error.json()['message'], {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Warning'
        }).subscribe((res) => {
          localStorage.clear();
          this.router.navigate(['/login']);
          dialogSubscript.unsubscribe();
        });
      } else {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
      this.progress.done();
      logoutSubscription.unsubscribe();
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
