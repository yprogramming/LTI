import { InternetListComponent } from './internet/internet-list/internet-list.component';
import { InternetUpdateComponent } from './internet/internet-update/internet-update.component';
import { InternetInsertComponent } from './internet/internet-insert/internet-insert.component';
import { AnotherUpdateComponent } from './another-update/another-update.component';
import { AnotherInsertComponent } from './another-insert/another-insert.component';
import { AnotherListComponent } from './another-list/another-list.component';
import { AnotherComponent } from './another.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
const routes: Routes = [{
    path: '',
    component: AnotherComponent,
    children: [
      {
        path: '',
        component: AnotherListComponent,
      }, {
        path: 'insert',
        component: AnotherInsertComponent
      }, {
        path: 'detail/:id',
        component: AnotherUpdateComponent
      }, {
        path: 'internet',
        component: InternetListComponent
      }, {
        path: 'internet/insert',
        component: InternetInsertComponent
      }, {
        path: 'internet/detail/:id',
        component: InternetUpdateComponent
      }
    ],
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class AnotherRoutingModule { }