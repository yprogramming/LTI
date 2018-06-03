import { AddressUpdateComponent } from './address-update/address-update.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressComponent } from './address.component';
import { AddressListComponent } from './address-list/address-list.component';
import { AddressInsertComponent } from './address-insert/address-insert.component';
const routes: Routes = [{
    path: '',
    component: AddressComponent,
    children: [
      {
        path: '',
        component: AddressListComponent,
      }, {
        path: 'insert',
        component: AddressInsertComponent
      }, {
        path: 'district/:id',
        component: AddressUpdateComponent
      }/*, {
        path: 'update/:id/all',
        component: RestaurantUpdateAllComponent
      },*/
    ],
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class AddressRoutingModule { }
