import { NgxCoolDialogsModule } from 'ngx-cool-dialogs';
import { TooltipModule } from 'ngx-tooltip';
import { ImageCropperModule } from 'ngx-img-cropper';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AgmCoreModule } from '@agm/core';
import { LoadersCssModule } from 'angular2-loaders-css';
import { AnotherRoutingModule } from './another-routing.module';
import { AnotherComponent } from './another.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnotherListComponent } from './another-list/another-list.component';
import { AnotherInsertComponent } from './another-insert/another-insert.component';
import { AnotherUpdateComponent } from './another-update/another-update.component';
import { InternetInsertComponent } from './internet/internet-insert/internet-insert.component';
import { InternetUpdateComponent } from './internet/internet-update/internet-update.component';
import { InternetListComponent } from './internet/internet-list/internet-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const another_component = [
  AnotherComponent,
  AnotherListComponent,
  AnotherInsertComponent,
  AnotherUpdateComponent,
  InternetInsertComponent,
  InternetUpdateComponent,
  InternetListComponent
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AnotherRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBXoeOmRRzSl0b4iUBadAz8M-_Zva0DpfQ'
    }),
    NguiAutoCompleteModule,
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
    }),
    LoadersCssModule
  ],
  declarations: [
    ...another_component
  ]
})
export class AnotherModule { }
