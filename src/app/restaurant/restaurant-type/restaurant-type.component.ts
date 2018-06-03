import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-restaurant-type',
  templateUrl: './restaurant-type.component.html',
  styleUrls: ['./restaurant-type.component.css']
})
export class RestaurantTypeComponent implements OnInit {

  restaurantTypeForm: FormGroup;
  checkVisible: Boolean = false;
  constructor(
    formBuilder: FormBuilder
  ) {
    this.restaurantTypeForm = formBuilder.group({
      res_type_name: ['', [Validators.required]]
    });
   }

  ngOnInit() {
  }

  saveRestaurantType() {
    console.log(this.restaurantTypeForm.value);
  }

}
