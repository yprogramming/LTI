import { PipesModule } from './../pipes/pipes.module';
import { NgProgressModule } from 'ngx-progressbar';
import { TransportationService } from './../services/transportation.service';
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
    FormsModule,
    ReactiveFormsModule,
    TransportationRoutingModule,
    PipesModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBXoeOmRRzSl0b4iUBadAz8M-_Zva0DpfQ'
    }),
    NguiAutoCompleteModule,
    ImageCropperModule,
    TooltipModule,
    NgProgressModule
  ],
  declarations: [
    ...tran_component
  ],
  providers: [ TransportationService ]
})
export class TransportationModule { }
