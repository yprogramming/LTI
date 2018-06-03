import { LoadersCssModule } from 'angular2-loaders-css';
import { NgxCoolDialogsModule } from 'ngx-cool-dialogs';
import { TooltipModule } from 'ngx-tooltip';
import { ImageCropperModule } from 'ngx-img-cropper';
import { AgmCoreModule } from '@agm/core';
import { RestaurantInsertComponent } from './restaurant-insert/restaurant-insert.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { RestaurantUpdateComponent } from './restaurant-update/restaurant-update.component';
import { RestaurantComponent } from './restaurant.component';
import { RestaurantTypeComponent } from './restaurant-type/restaurant-type.component';
import { FoodTypeComponent } from './food-type/food-type.component';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NgProgressModule } from 'ngx-progressbar';

const res_component = [
  RestaurantComponent,
  RestaurantListComponent,
  RestaurantInsertComponent,
  RestaurantUpdateComponent,
  RestaurantTypeComponent,
  FoodTypeComponent
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RestaurantRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBXoeOmRRzSl0b4iUBadAz8M-_Zva0DpfQ'
    }),
    NguiAutoCompleteModule,
    ImageCropperModule,
    TooltipModule,
    NgxCoolDialogsModule.forRoot({
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'Yes',
      cancelButtonText: 'No',
      color: 'black',
      titles: {
        alert: 'Dialog',
        confirm: 'Confirmation',
        prompt: 'Dialog'
      }
    }),
    NgProgressModule,
    LoadersCssModule
  ],
  declarations: [
    ...res_component
  ]
})
export class RestaurantModule { }
