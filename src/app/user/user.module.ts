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
    NgxCoolDialogsModule.forRoot({
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'Yes',
      cancelButtonText: 'No',
      color: 'black',
      titles: {
        alert: 'Dialog',
        confirm: 'Confirmation',
        prompt: 'Dialog'
      }
    })
  ],
  declarations: [
    ...user_component
  ]
})
export class UserModule { }
