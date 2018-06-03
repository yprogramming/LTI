import { AttractionTypeComponent } from './attraction-type/attraction-type.component';
import { AttractionUpdateComponent } from './attraction-update/attraction-update.component';
import { AttractionInsertComponent } from './attraction-insert/attraction-insert.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AttractionsComponent } from './attractions.component';
import { AttractionListComponent } from './attraction-list/attraction-list.component';
const routes: Routes = [{
    path: '',
    component: AttractionsComponent,
    children: [
      {
        path: '',
        component: AttractionListComponent,
      }, {
        path: 'insert',
        component: AttractionInsertComponent
      }, {
        path: 'detail/:id',
        component: AttractionUpdateComponent
      }, {
        path: 'type',
        component: AttractionTypeComponent
      }
    ],
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class AttractionsRoutingModule { }
