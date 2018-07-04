import { NotificationGaurd } from './auth-guard/notification.guard';
import { NotificationService } from './services/notification.service';
import { AddressService } from './services/address.service';
import { LoginedService } from './auth-guard/logined.service';
import { NgxCoolDialogsModule } from 'ngx-cool-dialogs';
import { UserService } from './services/user.service';
import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// AngularFire2 Configuration
import {AngularFireModule} from 'angularfire2';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {environment} from '../environments/environment';

// Progress module
import { NgProgressModule } from 'ngx-progressbar';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterService } from './auth-guard/register.service';
import { LoadersCssModule } from 'angular2-loaders-css';
import { LoginService } from './auth-guard/login.service';

/*const config: NgProgressConfig = {
  speed: 200,
  spinner: true,
  spinnerPosition: 'right',
  direction: 'ltr+',
  thick: false,
  max: 1,
  min: 100,
  meteor: true,
  trickleSpeed: 300,
  color: 'red',
  ease: 'linear'
};*/

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
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
    }),
    AppRoutingModule,
    NgProgressModule,
    LoadersCssModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    RegisterService,
    UserService,
    LoginService,
    LoginedService,
    AddressService,
    NotificationGaurd,
    NotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
