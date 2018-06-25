import { StaticFunc } from './../../function-usages/static.func';
import { TransportationService } from './../../services/transportation.service';
import { Router } from '@angular/router';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { NgProgress } from 'ngx-progressbar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transportation-type',
  templateUrl: './transportation-type.component.html',
  styleUrls: ['./transportation-type.component.css']
})
export class TransportationTypeComponent implements OnInit {

  transportationTypeForm: FormGroup;
  new_name: string;
  transportation_types: Array<Object> = [];

  checkUpdate: Array<boolean> = [];
  constructor(
    private formBuilder: FormBuilder,
    public progress: NgProgress,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router,
    private transportationService: TransportationService
  ) {
    this.progress.start();
    this.transportationTypeForm = formBuilder.group({
      tran_type_name: ['', [Validators.required]]
    });
    this.transportationService.getTransportationTypes().subscribe((types) => {
      this.transportation_types = types.json()['data'];
      this.progress.done();
    }, (error) => {
      this.progress.done();
      if (error.status === 405) {
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
        this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Error'
        });
      }
    });
  }

  ngOnInit() {
  }

  viewEditType(i) {
    this.new_name = this.transportation_types[i]['name'];
    for (let j = 0; j < this.transportation_types.length; j++) {
      if (j !== i) {
        this.checkUpdate[j] = false;
      }
    }
    this.checkUpdate[i] = true;
  }

  saveTransportationType() {
    if (this.transportationTypeForm.valid) {
      this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນປະເພດສະຖານີຂົນສົ່ງໂດຍສານນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Insert'
      }).subscribe((res) => {
        if (res) {
          this.transportationService.insertTransportationType(this.transportationTypeForm.value).subscribe((new_type) => {
            this.transportation_types.push(new_type.json()['data']);
            this.transportationTypeForm.reset();
          }, (error) => {
            if (error.status === 405) {
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            }
          });
        }
      });
    } else {
      StaticFunc.triggerForm(this.transportationTypeForm);
    }
  }

  updateType(i) {
    if (this.new_name.trim()) {
      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນປະເພດສະຖານີຂົນສົ່ງໂດຍສານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          const data = {
            shelt_type_id: this.transportation_types[i]['_id'],
            shelt_type_name: this.new_name
          };
          this.transportationService.updateTransportationType(data).subscribe((updated_type) => {
            this.transportation_types[i]['name'] = this.new_name;
            this.checkUpdate[i] = false;
          }, (error) => {
            if (error.status === 405) {
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
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

  deleteType(i, id) {
    this.coolDialogs.confirm(`ລົບຂໍ້ມູນປະເພດສະຖານີຂົນສົ່ງໂດຍສານນີ້ແທ້ ຫຼື ບໍ?
                            (ຖ້າລົບ ຂໍ້ມູນສະຖານີທັງໝົດຂອງປະເພດນີ້ຈະຖືກລົບໄປດ້ວຍ)`, {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.transportationService.deleteTransportationType(id).subscribe((success) => {
          this.transportation_types.splice(i, 1);
        }, (error) => {
          if (error.status === 405) {
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
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
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
