import { NotificationListComponent } from './notification-list/notification-list.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
const routes: Routes = [{
    path: '',
    component: NotificationComponent,
    children: [
      {
        path: '',
        component: NotificationListComponent,
      }, {
        path: 'detail/:id',
        component: NotificationDetailComponent
      }
    ]
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class NotificationRoutingModule { }
