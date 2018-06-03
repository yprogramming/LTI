import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantTypeComponent } from './restaurant-type/restaurant-type.component';
import { RestaurantUpdateComponent } from './restaurant-update/restaurant-update.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { RestaurantComponent } from './restaurant.component';
import { RestaurantInsertComponent } from './restaurant-insert/restaurant-insert.component';
import { FoodTypeComponent } from './food-type/food-type.component';
const routes: Routes = [{
    path: '',
    component: RestaurantComponent,
    children: [
      {
        path: '',
        component: RestaurantListComponent,
      }, {
        path: 'insert',
        component: RestaurantInsertComponent
      }, {
        path: 'detail/:id',
        component: RestaurantUpdateComponent
      }, {
        path: 'type',
        component: RestaurantTypeComponent
      }, {
        path: 'food/type',
        component: FoodTypeComponent
      }
    ],
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class RestaurantRoutingModule { }