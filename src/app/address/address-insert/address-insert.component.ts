import { Router } from '@angular/router';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { AddressService } from './../../services/address.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StaticFunc } from '../../function-usages/static.func';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-address-insert',
  templateUrl: './address-insert.component.html',
  styleUrls: ['./address-insert.component.css']
})
export class AddressInsertComponent implements OnInit {


  savingChecked: Boolean = false;
  savedChecked: Boolean = false;

  errorMessage: String = null;
  addressForm: FormGroup;
  constructor(
    formBuilder: FormBuilder,
    private addressService: AddressService,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router
  ) {
    this.addressForm = formBuilder.group({
      add_province: ['', [Validators.required]],
      add_districts: formBuilder.array([this.initDistrict()])
    });
   }

  ngOnInit() {
    console.log(this.villageLength(0));
  }

  initDistrict() {
    return new FormGroup({
      add_district: new FormControl('', [Validators.required]),
      add_villages: new FormArray([this.initVillage()])
    });
  }
  getDistrictControls() {
    return (<FormArray>this.addressForm.get('add_districts')).controls;
  }
  districtLength() {
    return (<FormArray>this.addressForm.get('add_districts')).length;
  }
  removeDistrict(index) {
    (<FormArray>this.addressForm.get('add_districts')).removeAt(index);
  }
  addNewDistrict() {
    (<FormArray>this.addressForm.get('add_districts')).push(this.initDistrict());
  }

  initVillage() {
    return new FormGroup({
      add_village: new FormControl('', [Validators.required])
    });
  }

  villageLength(index) {
    return (<FormArray>
      (<FormGroup>(
        <FormArray>this.addressForm.get('add_districts')
      ).controls[index])
      .get('add_villages')
    ).length;
  }
  removeVillage( dis_index, vil_index) {
    (<FormArray>
      (<FormGroup>(
        <FormArray>this.addressForm.get('add_districts')
      ).controls[dis_index])
      .get('add_villages')
    ).removeAt(vil_index);
  }

  saveAddress() {
    if (this.addressForm.valid) {
      this.savingChecked = true;
      const insertSubscript: Subscription = this.addressService.insertAddress(this.addressForm.value).subscribe((success) => {
        this.savingChecked = false;
        this.savedChecked = true;
        setTimeout(() => {
          this.savedChecked = false;
          if (this.districtLength() > 0) {
            for (let i = 1; i < this.districtLength(); i++) {
              this.removeDistrict(i);
            }
            if (this.villageLength(0) > 1) {
              for (let j = 1; j < this.villageLength(0); j++) {
                this.removeVillage( 0, j);
              }
            }
          }
          this.addressForm.reset();
          insertSubscript.unsubscribe();
        }, 3000);
      }, (error) => {
        if (error.status === 405) {
          const dialogSubscript: Subscription = this.coolDialogs.alert(error.json()['message'], {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Warning'
          }).subscribe((res) => {
            localStorage.clear();
            dialogSubscript.unsubscribe();
            this.router.navigate(['/login']);
          });
        } else if (error.status <= 423 && error.status >= 400) {
          this.errorMessage = error.json()['message'];
        } else {
          this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Error'
          });
        }
        insertSubscript.unsubscribe();
      });
    } else {
      StaticFunc.triggerForm(this.addressForm);
    }
  }
}
