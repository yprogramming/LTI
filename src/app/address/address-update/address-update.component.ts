import { NgProgress } from 'ngx-progressbar';
import { StaticFunc } from './../../function-usages/static.func';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { AddressService } from './../../services/address.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-address-update',
  templateUrl: './address-update.component.html',
  styleUrls: ['./address-update.component.css']
})
export class AddressUpdateComponent implements OnInit {

  villageForm: FormGroup;
  updateVillageForm: FormGroup;
  checkInsert = false;

  checkVillageUpdate: Array<boolean> = [];
  district: any;
  originalVillage: Array<{id: any, name: string}>;

  disid = '';

  constructor(
    private formBuilder: FormBuilder,
    public progress: NgProgress,
    private addressService: AddressService,
    private router: Router,
    private query: ActivatedRoute,
    private coolDialogs: NgxCoolDialogsService,
  ) {

    this.progress.start();
    this.district = {};
    this.district.villages = [];
    // Form
    this.villageForm = formBuilder.group({
      add_village: [null, [Validators.required]]
    });

    this.updateVillageForm = this.formBuilder.group({
      add_village: [null, [Validators.required]]
    });

    query.params.subscribe((dis_id) => {
     if (dis_id.id) {
     this.disid = dis_id.id;
      const addressSubscript: Subscription = addressService.getDistricts(this.disid).subscribe((district) => {
        this.district = district.json()['data'];
        this.progress.done();
        addressSubscript.unsubscribe();
      }, (error) => {
        this.progress.done();
        if (error.status === 405) {
          const dialogSubscript: Subscription = this.coolDialogs.alert(error.json()['message'], {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Warning'
          }).subscribe((ok) => {
            localStorage.clear();
            dialogSubscript.unsubscribe();
            this.router.navigate(['/login']);
          });
        } else if (error.status <= 423 && error.status >= 400) {
          const dialogSubscript: Subscription = this.coolDialogs.alert(error.json()['message'], {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Error'
          }).subscribe((ok) => {
            dialogSubscript.unsubscribe();
            this.router.navigate(['/dashboard', 'address']);
          });
        } else {
          this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Error'
          });
        }
        addressSubscript.unsubscribe();
      });
     }
    });

   }

  ngOnInit() {
  }

  villageLength() {
    if (this.district) {
      return <Array<Object>>(this.district.villages).length;
    }
    return 0;
  }

  editVillage(i, id) {
    if (this.updateVillageForm.valid) {
      const data = {
        village_id: id,
        vil_new_name: this.updateVillageForm.value.add_village
      };
      const confirmSubscript: Subscription = this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນບ້ານນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          const uVillageSubscript: Subscription = this.addressService.updateVillage(data).subscribe((success) => {
            this.district['villages'][i].village = this.updateVillageForm.value.add_village;
            this.updateVillageForm.reset();
            this.checkVillageUpdate[i] = false;
            uVillageSubscript.unsubscribe();
          }, (error) => {
            if (error.status === 405) {
              const dialogSubscript: Subscription = this.coolDialogs.alert(error.json()['message'], {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Warning'
              }).subscribe(() => {
                localStorage.clear();
                dialogSubscript.unsubscribe();
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
            uVillageSubscript.unsubscribe();
          });
        } else {
          this.checkVillageUpdate[i] = false;
        }
        confirmSubscript.unsubscribe();
      });
    }
    // console.log(i, id, this.updateVillageForm.value.att_village);
  }

  cancelSave() {
    this.checkInsert = false;
    this.villageForm.reset();
  }

  setEditInputValue(i, village: string) {
    for (let j = 0; j < this.district.villages.length; j++) {
      if (j !== i) {
        this.checkVillageUpdate[j] = false;
      }
    }
    this.updateVillageForm.get('add_village').setValue(village);
    this.checkVillageUpdate[i] = true;
  }

  deleteVillage(i, id) {
    const confirmSubscription: Subscription = this.coolDialogs.confirm('ລົບຂໍ້ມູນບ້ານນີ້ແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        const dVillageSubscript: Subscription = this.addressService.deleteVillage(id).subscribe((success) => {
          this.district['villages'].splice(i, 1);
          dVillageSubscript.unsubscribe();
        }, (error) => {
          if (error.status === 405) {
            const dialogSubscript: Subscription = this.coolDialogs.alert(error.json()['message'], {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Warning'
            }).subscribe(() => {
              localStorage.clear();
              dialogSubscript.unsubscribe();
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
          dVillageSubscript.unsubscribe();
        });
      }
      confirmSubscription.unsubscribe();
    });
  }

  saveVillage() {
    // this.district.villages.push();
    if (this.villageForm.valid) {
      const data = {
        district_id: this.district._id,
        new_village: this.villageForm.value.add_village
      };
      const confirmSubscript: Subscription = this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນບ້ານນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Insert'
      }).subscribe((res) => {
        if (res) {
          const aVillageSubscript: Subscription = this.addressService.insertVillage(data).subscribe((success) => {
            this.district['villages'].push(success.json()['data']);
            this.villageForm.reset();
            this.checkInsert = false;
            aVillageSubscript.unsubscribe();
          }, (error) => {
            if (error.status === 405) {
              const dialogSubscript: Subscription = this.coolDialogs.alert(error.json()['message'], {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Warning'
              }).subscribe(() => {
                localStorage.clear();
                dialogSubscript.unsubscribe();
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
            aVillageSubscript.unsubscribe();
          });
        }
        confirmSubscript.unsubscribe();
      });
    } else {
      StaticFunc.triggerForm(this.villageForm);
    }
  }
}
