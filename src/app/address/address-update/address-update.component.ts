import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-update',
  templateUrl: './address-update.component.html',
  styleUrls: ['./address-update.component.css']
})
export class AddressUpdateComponent implements OnInit {

  villageForm: FormGroup;
  checkInsert = false;

  checkVillageUpdate = [false, false, false, false, false, false];
  villages: Array<{id: any, name: string}>;
  originalVillage: Array<{id: any, name: string}>;

  constructor(
    formBuilder: FormBuilder
  ) {

    // Form
    this.villageForm = formBuilder.group({
      att_village: [null, [Validators.required]]
    });

    this.villages = [{
      id: 1,
      name: 'ຄຳຮຸ່ງ'
    }, {
      id: 2,
      name: 'ດົງໂດກ'
    }, {
      id: 3,
      name: 'ຕານມີໄຊ'
    }, {
      id: 4,
      name: 'ຫ້ວຍຫົງ'
    }, {
      id: 5,
      name: 'ຜະຂາວ'
    }, {
      id: 6,
      name: 'ສະພັງເມີກ'
    }];
   }

  ngOnInit() {
  }

  cancelUpdate(i) {
    // console.log(village);
    // this.villages[i].name = village;
    this.checkVillageUpdate[i] = false;
  }
  cancelSave() {
    this.checkInsert = false;
    this.villageForm.reset();
  }

  saveVillage() {
    this.villages.push({id: this.villages.length + 1, name: this.villageForm.value['att_village']});
    this.villageForm.reset();
    this.checkInsert = false;
  }
}
