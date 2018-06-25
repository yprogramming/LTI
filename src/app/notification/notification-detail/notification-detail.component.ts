import { NotificationService } from './../../services/notification.service';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { NgProgress } from 'ngx-progressbar';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.css']
})
export class NotificationDetailComponent implements OnInit {

  notification: Object = {};
  constructor(
    public progress: NgProgress,
    private router: Router,
    private query: ActivatedRoute,
    private coolDialogs: NgxCoolDialogsService,
    private notificationService: NotificationService
  ) {
    progress.start();
    query.params.subscribe((params) => {
      if (params.id) {
        const notification_id = params.id;
        notificationService.getNotificationDetail(notification_id).subscribe((notification) => {
          this.notification = notification.json()['data'];
          progress.done();
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
        });
      }
    });
   }

  ngOnInit() {
  }

}
