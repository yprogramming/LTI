import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TourCompanyComponent } from './tour-company.component';
import { CompanyUpdateComponent } from './company-update/company-update.component';
import { CompanyInsertComponent } from './company-insert/company-insert.component';
import { CompanyListComponent } from './company-list/company-list.component';

const routes: Routes = [{
    path: '',
    component: TourCompanyComponent,
    children: [
      {
        path: '',
        component: CompanyListComponent,
      }, {
        path: 'insert',
        component: CompanyInsertComponent
      }, {
        path: 'detail/:id',
        component: CompanyUpdateComponent
      }
    ],
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class TourCompanyRoutingModule { }