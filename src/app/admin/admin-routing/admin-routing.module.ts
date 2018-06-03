import { AddressComponent } from './../../address/address.component';
import { RestaurantComponent } from './../../restaurant/restaurant.component';
import { AttractionsComponent } from './../../attractions/attractions.component';
import { AdminDashboard1Component } from './../admin-dashboard1/admin-dashboard1.component';
import { AdminComponent } from './../admin.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ShelterComponent } from '../../shelter/shelter.component';
import { TransportationComponent } from '../../transportation/transportation.component';
import { TourCompanyComponent } from '../../tour-company/tour-company.component';
import { AnotherComponent } from '../../another/another.component';
import { UserComponent } from '../../user/user.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';

const routes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [
    {
      path: '',
      component: AdminDashboard1Component,
    }, {
      path: 'attraction',
      loadChildren: './../../attractions/attractions.module#AttractionsModule'
    }, {
      path: 'restaurant',
       loadChildren: './../../restaurant/restaurant.module#RestaurantModule',
    }, {
      path: 'report',
      loadChildren: './../../report/report.module#ReportModule'
    }, {
      path: 'shelter',
      loadChildren: './../../shelter/shelter.module#ShelterModule'
    }, {
      path: 'transportation',
      loadChildren: './../../transportation/transportation.module#TransportationModule'
    }, {
      path: 'company',
      loadChildren: './../../tour-company/tour-company.module#TourCompanyModule',
    }, {
      path: 'another',
      loadChildren: './../../another/another.module#AnotherModule',
    },
    {
      path: 'address',
       loadChildren: './../../address/address.module#AddressModule',
    },
    {
      path: 'user',
      loadChildren: './../../user/user.module#UserModule'
    },
    {
      path: 'profile/:id',
      component: UserProfileComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
