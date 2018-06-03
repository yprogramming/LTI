import { TransportationViewComponent } from './transportation-view/transportation-view.component';
import { ShelterViewComponent } from './shelter-view/shelter-view.component';
import { RestaurantViewComponent } from './restaurant-view/restaurant-view.component';
import { AttractionAllComponent } from './attraction-all/attraction-all.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReportComponent } from './report.component';
import { AttractionViewComponent } from './attraction-view/attraction-view.component';
import { CompanyViewComponent } from './company-view/company-view.component';
const routes: Routes = [{
    path: '',
    component: ReportComponent,
    children: [
      {
        path: 'attraction/all',
        component: AttractionAllComponent,
      }, {
        path: 'attraction/view',
        component: AttractionViewComponent
      }, {
        path: 'restaurant/view',
        component: RestaurantViewComponent
      }, {
        path: 'shelter/view',
        component: ShelterViewComponent
      }, {
        path: 'transportation/view',
        component: TransportationViewComponent
      }, {
        path: 'company/view',
        component: CompanyViewComponent
      },
      {
          path: '',
          redirectTo: 'attraction/all',
          pathMatch: 'full'
      }
    ],
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class ReportRoutingModule { }