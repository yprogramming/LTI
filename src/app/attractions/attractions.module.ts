import { NgProgressModule } from 'ngx-progressbar';
import { AttractionsService } from './../services/attractions.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AttractionsRoutingModule } from './attractions-routing.module';
import { AttractionsComponent } from './attractions.component';
import { AttractionUpdateComponent } from './attraction-update/attraction-update.component';
import { AttractionInsertComponent } from './attraction-insert/attraction-insert.component';
import { AttractionListComponent } from './attraction-list/attraction-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttractionTypeComponent } from './attraction-type/attraction-type.component';
import { ImageCropperModule } from 'ngx-img-cropper';
import {TooltipModule} from 'ngx-tooltip';
import { NgxCoolDialogsModule, NgxCoolDialogsService } from 'ngx-cool-dialogs';

const att_component = [
  AttractionsComponent,
  AttractionListComponent,
  AttractionInsertComponent,
  AttractionUpdateComponent,
  AttractionTypeComponent
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AttractionsRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBXoeOmRRzSl0b4iUBadAz8M-_Zva0DpfQ'
    }),
    NguiAutoCompleteModule,
    ImageCropperModule,
    TooltipModule,
    NgProgressModule
  ],
  declarations: [
    ...att_component
  ],
  providers: [AttractionsService]
})
export class AttractionsModule { }
