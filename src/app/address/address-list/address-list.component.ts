import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {

  checkAddNewDistrict: Boolean = false;
  checkProvinceUpdate: Boolean = false;
  checkVisible: Boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
