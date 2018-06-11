import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { AddressService } from './../../services/address.service';
import { NgProgress } from 'ngx-progressbar';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {

  checkAddNewDistrict: Array<boolean>;
  checkProvinceUpdate: Array<boolean>;
  checkVisible: Array<Array<boolean>>;
  districtUpdateForm: FormGroup;

  // provinces data
  provinces: Array<Object>;

  constructor(
    private formBuilder: FormBuilder,
    public progress: NgProgress,
    private addressService: AddressService,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router
  ) {
    progress.start();
    this.checkProvinceUpdate = [];
    this.checkVisible = [];
    this.checkAddNewDistrict = [];
    this.districtUpdateForm = formBuilder.group({
      add_district: ['', [Validators.required]]
    });
    addressService.getProvinces().subscribe((data: any) => {
      this.provinces = data.json()['data'];
      for (let i = 0; i < this.provinces.length; i++) {
        this.checkVisible[i] = [];
      }
      progress.done();
    }, (error) => {
      if (error.status === 410) {
        this.coolDialogs.alert(error.json()['message'], {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Warning'
        }).subscribe((res) => {
          localStorage.clear();
          this.router.navigate(['/login']);
        });
      } else if (error.status <= 423 && error.status >= 400) {
        this.coolDialogs.alert(error.json()['message'], {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Error'
        });
      } else {
        this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Error'
        });
      }
      progress.done();
    });
   }

  ngOnInit() {
  }

  editProvince(i, id, newName: string) {
    if (newName.trim()) {
      const data = {
        province_id: id,
        prov_new_name: newName
      };
      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນແຂວງນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.addressService.updateProvince(data).subscribe((success) => {
            this.provinces[i]['province'] = newName;
            this.checkProvinceUpdate[i] = false;
            // const alertSubscription: Subscription = this.coolDialogs.alert('ແກ້ໄຂຂໍ້ມູນແຂວງສຳເລັດແລ້ວ', {
            //   theme: 'material', // available themes: 'default' | 'material' | 'dark'
            //   okButtonText: 'OK',
            //   color: 'black',
            //   title: 'Update'
            // }).subscribe(() => {
            //   this.provinces[i]['province'] = newName;
            //   this.checkProvinceUpdate[i] = false;
            //   alertSubscription.unsubscribe();
            // });
          }, (error) => {
            if (error.status === 410) {
              this.coolDialogs.alert(error.json()['message'], {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Warning'
              }).subscribe(() => {
                localStorage.clear();
                this.router.navigate(['/login']);
              });
            } else if (error.status <= 423 && error.status >= 400) {
              this.coolDialogs.alert(error.json()['message'], {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            } else {
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງສົ່ງຂໍ້ມູນຫາເຊີເວີ', {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            }
          });
        } else {
          this.checkProvinceUpdate[i] = false;
        }
      });
    }
  }

  deleteProvince(i, id) {
    console.log(i, id);
    this.coolDialogs.confirm('ລົບຂໍ້ມູນແຂວງນີ້ແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.addressService.deleteProvince(id).subscribe((success) => {
          console.log('delete success fully');
          this.provinces.splice(i, 1);
        }, (error) => {
          if (error.status === 410) {
            this.coolDialogs.alert(error.json()['message'], {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Warning'
            }).subscribe(() => {
              localStorage.clear();
              this.router.navigate(['/login']);
            });
          } else if (error.status <= 423 && error.status >= 400) {
            this.coolDialogs.alert(error.json()['message'], {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Error'
            });
          } else {
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງສົ່ງຂໍ້ມູນຫາເຊີເວີ', {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Error'
            });
          }
        });
      }
    });
  }

  setDistrictInputEditValue(i, j, disNewName) {
    for (let k = 0; k < this.provinces.length; k++) {
      for (let l = 0; l < this.provinces[k]['districts'].length; l ++) {
        if (!(k === i && l === j)) {
          this.checkVisible[k][l] = false;
        }
      }
    }
    this.districtUpdateForm.get('add_district').setValue(disNewName);
    this.checkVisible[i][j] = true;
  }

  setProvinceEdit(i) {
    for (let j = 0; j < this.provinces.length; j ++) {
      if (j !== i) {
        this.checkProvinceUpdate[j] = false;
      }
    }
    this.checkProvinceUpdate[i] = true;
  }

  setAddNewDistrict(i) {
    for (let j = 0; j < this.provinces.length; j ++) {
      if (j !== i) {
        this.checkAddNewDistrict[j] = false;
      }
    }
    this.checkAddNewDistrict[i] = true;
  }

  editDistrict(i, j, id) {
    if (this.districtUpdateForm.valid) {
      const data = {
        district_id: id,
        dis_new_name: this.districtUpdateForm.value.add_district
      };
      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນເມືອງນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.addressService.updateDistrict(data).subscribe((success) => {
            this.provinces[i]['districts'][j].district = this.districtUpdateForm.value.add_district;
            this.checkVisible[i][j] = false;
            // const alertSubscription: Subscription = this.coolDialogs.alert('ແກ້ໄຂຂໍ້ມູນເມືອງສຳເລັດແລ້ວ', {
            //   theme: 'material', // available themes: 'default' | 'material' | 'dark'
            //   okButtonText: 'OK',
            //   color: 'black',
            //   title: 'Update'
            // }).subscribe(() => {
            //   this.provinces[i]['districts'][j].district = this.districtUpdateForm.value.add_district;
            //   this.checkVisible[i][j] = false;
            //   alertSubscription.unsubscribe();
            // });
          }, (error) => {
            if (error.status === 410) {
              this.coolDialogs.alert(error.json()['message'], {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Warning'
              }).subscribe(() => {
                localStorage.clear();
                this.router.navigate(['/login']);
              });
            } else if (error.status <= 423 && error.status >= 400) {
              this.coolDialogs.alert(error.json()['message'], {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            } else {
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງສົ່ງຂໍ້ມູນຫາເຊີເວີ', {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            }
          });
        } else {
          this.checkVisible[i][j] = false;
        }
      });
    }
    // console.log(i, j, id, this.districtUpdateForm.value);
  }

  saveNewDistrict(i, id, newDis: string) {
    if (newDis.trim()) {
      const data = {
        province_id: id,
        new_district: newDis
      };
      this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນເມືອງນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Insert'
      }).subscribe((res) => {
        if (res) {
          this.addressService.insertDistrict(data).subscribe((success) => {
            this.provinces[i]['districts'].push(success.json()['data']);
            this.checkAddNewDistrict[i] = false;
            // const alertSubscription: Subscription = this.coolDialogs.alert('ບັນທືກຂໍ້ມູນສຳເລັດແລ້ວ', {
            //   theme: 'material', // available themes: 'default' | 'material' | 'dark'
            //   okButtonText: 'OK',
            //   color: 'black',
            //   title: 'Insert'
            // }).subscribe(() => {
            //   this.provinces[i]['districts'].push(success.json()['data']);
            //   this.checkAddNewDistrict[i] = false;
            //   alertSubscription.unsubscribe();
            // });
          }, (error) => {
            if (error.status === 410) {
              this.coolDialogs.alert(error.json()['message'], {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Warning'
              }).subscribe(() => {
                localStorage.clear();
                this.router.navigate(['/login']);
              });
            } else if (error.status <= 423 && error.status >= 400) {
              this.coolDialogs.alert(error.json()['message'], {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            } else {
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງສົ່ງຂໍ້ມູນຫາເຊີເວີ', {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            }
          });
        }
      });
    }
  }


  deleteDistrict(i, j, id) {
    this.coolDialogs.confirm('ລົບຂໍ້ມູນເມືອງນີ້ແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.addressService.deleteDistrict(id).subscribe((success) => {
          console.log('delete success fully');
          this.provinces[i]['districts'].splice(j, 1);
        }, (error) => {
          if (error.status === 410) {
            this.coolDialogs.alert(error.json()['message'], {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Warning'
            }).subscribe(() => {
              localStorage.clear();
              this.router.navigate(['/login']);
            });
          } else if (error.status <= 423 && error.status >= 400) {
            this.coolDialogs.alert(error.json()['message'], {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Error'
            });
          } else {
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງສົ່ງຂໍ້ມູນຫາເຊີເວີ', {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Error'
            });
          }
        });
      }
    });
  }

}
