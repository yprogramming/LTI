import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-food-type',
  templateUrl: './food-type.component.html',
  styleUrls: ['./food-type.component.css']
})
export class FoodTypeComponent implements OnInit {

  checkVisible: Boolean = false;
  foodTypeForm: FormGroup;
  constructor(
    formBuilder: FormBuilder
  ) {
    this.foodTypeForm = formBuilder.group({
      food_type: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  saveFoodType() {
    console.log(this.foodTypeForm.value);
  }

}
