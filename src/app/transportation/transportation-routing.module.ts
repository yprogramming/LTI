import { TransportationTypeComponent } from './transportation-type/transportation-type.component';
import { TransportationUpdateComponent } from './transportation-update/transportation-update.component';
import { TransportationListComponent } from './transportation-list/transportation-list.component';
import { TransportationComponent } from './transportation.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TransportationInsertComponent } from './transportation-insert/transportation-insert.component';
const routes: Routes = [{
    path: '',
    component: TransportationComponent,
    children: [
      {
        path: '',
        component: TransportationListComponent,
      }, {
        path: 'insert',
        component: TransportationInsertComponent
      }, {
        path: 'detail/:id',
        component: TransportationUpdateComponent
      }, {
        path: 'type',
        component: TransportationTypeComponent
      }
    ],
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class TransportationRoutingModule { }