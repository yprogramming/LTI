import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-shelter-type',
  templateUrl: './shelter-type.component.html',
  styleUrls: ['./shelter-type.component.css']
})
export class ShelterTypeComponent implements OnInit {

  shelterTypeForm: FormGroup;
  checkVisible: Boolean = false;
  constructor(
    formBuilder: FormBuilder
  ) {
    this.shelterTypeForm = formBuilder.group({
      shelt_type_name: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  saveShelterType() {
    console.log(this.shelterTypeForm.value);
  }
}
