import { NgProgressModule } from 'ngx-progressbar';
import { NgxCoolDialogsModule } from 'ngx-cool-dialogs';
import { TooltipModule } from 'ngx-tooltip';
import { AddressRoutingModule } from './address-routing.module';
import { AddressComponent } from './address.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressListComponent } from './address-list/address-list.component';
import { AddressInsertComponent } from './address-insert/address-insert.component';
import { AddressUpdateComponent } from './address-update/address-update.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
const add_component = [
  AddressComponent,
  AddressListComponent,
  AddressInsertComponent,
  AddressUpdateComponent
];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddressRoutingModule,
    NgProgressModule,
    TooltipModule
  ],
  declarations: [
    ...add_component
  ]
})
export class AddressModule { }
