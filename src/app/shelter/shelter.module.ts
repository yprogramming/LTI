import { LoadersCssModule } from 'angular2-loaders-css';
import { NgxCoolDialogsModule } from 'ngx-cool-dialogs';
import { TooltipModule } from 'ngx-tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-img-cropper';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShelterListComponent } from './shelter-list/shelter-list.component';
import { ShelterInsertComponent } from './shelter-insert/shelter-insert.component';
import { ShelterUpdateComponent } from './shelter-update/shelter-update.component';
import { ShelterComponent } from './shelter.component';
import { ShelterTypeComponent } from './shelter-type/shelter-type.component';
import { ShelterRoutingModule } from './shelter-routing.module';

const shel_component = [
  ShelterComponent,
  ShelterListComponent,
  ShelterInsertComponent,
  ShelterUpdateComponent,
  ShelterTypeComponent
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShelterRoutingModule,
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
    ...shel_component
  ]
})
export class ShelterModule { }
