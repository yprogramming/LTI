import { PipesModule } from './../pipes/pipes.module';
import { NgProgressModule } from 'ngx-progressbar';
import { TooltipModule } from 'ngx-tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-img-cropper';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AgmCoreModule } from '@agm/core';
import { TourCompanyRoutingModule } from './tour-company-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyInsertComponent } from './company-insert/company-insert.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyUpdateComponent } from './company-update/company-update.component';
import { TourCompanyComponent } from './tour-company.component';
import { CompanyService } from '../services/company.service';

const com_component = [
  TourCompanyComponent,
  CompanyInsertComponent,
  CompanyListComponent,
  CompanyUpdateComponent
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TourCompanyRoutingModule,
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
    ...com_component
  ],
  providers: [CompanyService]
})
export class TourCompanyModule { }
