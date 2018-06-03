import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserInsertComponent } from './user-insert/user-insert.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserComponent } from './user.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserCheckComponent } from './user-check/user-check.component';
const routes: Routes = [{
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        component: UserListComponent,
      }, {
        path: 'register',
        component: UserInsertComponent
      }, {
        path: 'check/:id',
        component: UserCheckComponent
      }, {
        path: 'detail/:id',
        component: UserDetailComponent
      }
    ],
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class UserRoutingModule { }