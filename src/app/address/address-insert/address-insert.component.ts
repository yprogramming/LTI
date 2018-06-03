import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-insert',
  templateUrl: './address-insert.component.html',
  styleUrls: ['./address-insert.component.css']
})
export class AddressInsertComponent implements OnInit {

  addressForm: FormGroup;
  constructor(
    formBuilder: FormBuilder
  ) {
    this.addressForm = formBuilder.group({
      add_province: ['', [Validators.required]],
      att_districts: formBuilder.array([this.initDistrict()])
    });
   }

  ngOnInit() {
  }

  initDistrict() {
    return new FormGroup({
      add_district: new FormControl('', [Validators.required]),
      add_villages: new FormArray([this.initVillage()])
    });
  }
  getDistrictControls() {
    return (<FormArray>this.addressForm.get('att_districts')).controls;
  }
  districtLength() {
    return (<FormArray>this.addressForm.get('att_districts')).length;
  }
  removeDistrict(index) {
    (<FormArray>this.addressForm.get('att_districts')).removeAt(index);
  }
  addNewDistrict() {
    (<FormArray>this.addressForm.get('att_districts')).push(this.initDistrict());
  }

  initVillage() {
    return new FormGroup({
      add_village: new FormControl('', [Validators.required])
    });
  }

  saveAddress() {
    if (this.addressForm.valid) {
      console.log(this.addressForm.value);
    } else {
      alert('ຂໍ້ມູນຂອງທຸກໆຟິວຫ້າມວ່າງ');
    }
  }
}
