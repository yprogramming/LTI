import { NgxCoolDialogsModule } from 'ngx-cool-dialogs';
import { TooltipModule } from 'ngx-tooltip';
import { ImageCropperModule } from 'ngx-img-cropper';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AgmCoreModule } from '@agm/core';
import { TransportationRoutingModule } from './transportation-routing.module';
import { TransportationComponent } from './transportation.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportationListComponent } from './transportation-list/transportation-list.component';
import { TransportationInsertComponent } from './transportation-insert/transportation-insert.component';
import { TransportationUpdateComponent } from './transportation-update/transportation-update.component';
import { TransportationTypeComponent } from './transportation-type/transportation-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const tran_component = [
  TransportationComponent,
  TransportationListComponent,
  TransportationInsertComponent,
  TransportationUpdateComponent,
  TransportationTypeComponent
];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TransportationRoutingModule,
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
    })
  ],
  declarations: [
    ...tran_component
  ]
})
export class TransportationModule { }