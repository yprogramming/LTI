import { ShelterInsertComponent } from './shelter-insert/shelter-insert.component';
import { ShelterListComponent } from './shelter-list/shelter-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShelterComponent } from './shelter.component';
import { ShelterUpdateComponent } from './shelter-update/shelter-update.component';
import { ShelterTypeComponent } from './shelter-type/shelter-type.component';
const routes: Routes = [{
    path: '',
    component: ShelterComponent,
    children: [
      {
        path: '',
        component: ShelterListComponent,
      }, {
        path: 'insert',
        component: ShelterInsertComponent
      }, {
        path: 'detail/:id',
        component: ShelterUpdateComponent
      }, {
        path: 'type',
        component: ShelterTypeComponent
      }
    ],
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class ShelterRoutingModule { }