import { NgProgressModule } from 'ngx-progressbar';
import { NotificationRoutingModule } from './notification-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
import { NotificationComponent } from './notification.component';

const noti_component = [
  NotificationComponent,
  NotificationListComponent,
  NotificationDetailComponent
];
@NgModule({
  imports: [
    CommonModule,
    NotificationRoutingModule,
    NgProgressModule
  ],
  declarations: [
    ...noti_component
  ]
})
export class NotificationModule { }
