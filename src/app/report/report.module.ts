import { NgProgressModule } from 'ngx-progressbar';
import { ReportService } from './../services/report.service';
import { ReportRoutingModule } from './report-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttractionAllComponent } from './attraction-all/attraction-all.component';
import { RestaurantViewComponent } from './restaurant-view/restaurant-view.component';
import { ShelterViewComponent } from './shelter-view/shelter-view.component';
import { TransportationViewComponent } from './transportation-view/transportation-view.component';
import { CompanyViewComponent } from './company-view/company-view.component';
import { AttractionViewComponent } from './attraction-view/attraction-view.component';
import { ReportComponent } from './report.component';

const rep_component = [
  ReportComponent,
  AttractionAllComponent,
  RestaurantViewComponent,
  ShelterViewComponent,
  TransportationViewComponent,
  CompanyViewComponent,
  AttractionViewComponent
];
@NgModule({
  imports: [
    CommonModule,
    ReportRoutingModule,
    NgProgressModule
  ],
  declarations: [
    ...rep_component
  ],
  providers: [ ReportService ]
})
export class ReportModule { }
