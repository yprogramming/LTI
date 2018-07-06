import { Subscription } from 'rxjs/Subscription';
import { NotificationService } from './../../services/notification.service';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { StaticFunc } from './../../function-usages/static.func';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {

  notifications: Object = {};
  user: Object;

  constructor(
    public progress: NgProgress,
    private router: Router,
    private coolDialogs: NgxCoolDialogsService,
    private notificationService: NotificationService
  ) {
    progress.start();
    this.user = JSON.parse(localStorage.getItem('lt_token'))['data'];
    if (StaticFunc.userMst(this.user['user_pms'])) {
      const subscript: Subscription = this.notificationService.getMstAllNotifications().subscribe((notifications) => {
        this.notifications['length'] = notifications.json()['length'];
        this.notifications['data'] = notifications.json()['data'];
        progress.done();
        subscript.unsubscribe();
      }, (error) => {
        progress.done();
        if (error.status === 405) {
          this.coolDialogs.alert(error.json()['message'], {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Warning'
          }).subscribe(() => {
            localStorage.clear();
            this.router.navigate(['/login']);
          });
        } else if (error.status <= 423 && error.status >= 400) {
          this.coolDialogs.alert(error.json()['message'], {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Notification'
          }).subscribe(() => {
            this.router.navigate(['/dashboard']);
          });
        } else {
          this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນຈາກເຊີເວີ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Error'
          }).subscribe(() => {
            this.router.navigate(['/dashboard']);
          });
        }
        subscript.unsubscribe();
       });
    } else {
      const subscript: Subscription = this.notificationService.getUsrAllNotifications().subscribe((notifications) => {
        this.notifications['length'] = notifications.json()['length'];
        this.notifications['data'] = notifications.json()['data'];
        progress.done();
        subscript.unsubscribe();
      }, (error) => {
        progress.done();
        if (error.status === 405) {
          this.coolDialogs.alert(error.json()['message'], {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Warning'
          }).subscribe(() => {
            localStorage.clear();
            this.router.navigate(['/login']);
          });
        } else if (error.status <= 423 && error.status >= 400) {
          this.coolDialogs.alert(error.json()['message'], {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Error'
          }).subscribe(() => {
            this.router.navigate(['/dashboard']);
          });
        } else {
          this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນຈາກເຊີເວີ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Error'
          });
        }
        subscript.unsubscribe();
      });
    }
  }

  ngOnInit() {
  }

  checkUserPMS() {
    return StaticFunc.userMst(this.user['user_pms']);
  }

  viewedNotification(notification_id: string) {
    const subscript: Subscription = this.notificationService.viewedNotification(notification_id).subscribe((res) => {
      subscript.unsubscribe();
    }, (error) => {
      subscript.unsubscribe();
    });
  }

}
