import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transportation-type',
  templateUrl: './transportation-type.component.html',
  styleUrls: ['./transportation-type.component.css']
})
export class TransportationTypeComponent implements OnInit {

  checkVisible: Boolean = false;
  transportationTypeForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.transportationTypeForm = formBuilder.group({
      tran_type_name: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  saveTransportationType() {
    console.log(this.transportationTypeForm.value);
  }

}
