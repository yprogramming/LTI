import { NgxCoolDialogsModule } from 'ngx-cool-dialogs';
import { TooltipModule } from 'ngx-tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-img-cropper';
import { UserRoutingModule } from './user-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { UserInsertComponent } from './user-insert/user-insert.component';
import { UserComponent } from './user.component';
import { UserCheckComponent } from './user-check/user-check.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { NgProgressModule } from 'ngx-progressbar';

const user_component = [
  UserComponent,
  UserListComponent,
  UserInsertComponent,
  UserCheckComponent,
  UserDetailComponent
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    ImageCropperModule,
    TooltipModule,
    NgProgressModule
  ],
  declarations: [
    ...user_component
  ]
})
export class UserModule { }
