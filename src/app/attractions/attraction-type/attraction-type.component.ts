import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-attraction-type',
  templateUrl: './attraction-type.component.html',
  styleUrls: ['./attraction-type.component.css']
})
export class AttractionTypeComponent implements OnInit {

  // Form property
  attractionTypeForm: FormGroup;
  data: Array<{id: any, type: string}>;

  checkUpdate: Array<boolean>;
  constructor(
    formBuilder: FormBuilder
  ) {
    this.checkUpdate = [];
    this.data = [
      {id: '1', type: 'ສະຖານທີ່ທ່ອງທ່ຽວທຳມະຊາດ'},
      {id: '2', type: 'ສະຖານທີ່ທ່ອງທ່ຽວປະຫວັດສາດ'},
      {id: '3', type: 'ສະຖານທີ່ທ່ອງທ່ຽວທາງວັດທະນະທຳ'},
      {id: '4', type: 'ສະຖານທີ່ທ່ອງທ່ຽວທາງສັງຄົມ'},
      {id: '5', type: 'ສະຖານທີ່ທ່ອງທ່ຽວກະສິກຳ'},
      {id: '6', type: 'ສະຖານທີ່ທ່ອງທ່ຽວບູຮານ'},
    ];
    let i = 0;
    for (i = 0; i < this.data.length; i++){
      this.checkUpdate[i] = false;
    }
    this.attractionTypeForm = formBuilder.group({
      att_type_name: ['', [Validators.required]]
    });
   }

  ngOnInit() {
  }

  saveAttractionType() {
    this.data.push({
        id: this.data.length + 1,
        type: this.attractionTypeForm.value.att_type_name
      });
      this.attractionTypeForm.reset();
  }
}
