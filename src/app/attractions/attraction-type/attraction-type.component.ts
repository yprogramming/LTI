import { Router } from '@angular/router';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { NgProgress } from 'ngx-progressbar';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AttractionsService } from '../../services/attractions.service';

@Component({
  selector: 'app-attraction-type',
  templateUrl: './attraction-type.component.html',
  styleUrls: ['./attraction-type.component.css']
})
export class AttractionTypeComponent implements OnInit {

  // Form property
  attractionTypeForm: FormGroup;
  new_name: string;
  attractions_types: Array<Object> = [];

  checkUpdate: Array<boolean> = [];

  constructor(
    formBuilder: FormBuilder,
    public progress: NgProgress,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router,
    private attractionsService: AttractionsService
  ) {
    this.progress.start();
    this.attractionTypeForm = formBuilder.group({
      att_type_name: ['', [Validators.required]]
    });
    this.attractionsService.getAttractionsTypes().subscribe((types) => {
      this.attractions_types = types.json()['data'];
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
    this.new_name = this.attractions_types[i]['name'];
    for (let j = 0; j < this.attractions_types.length; j++) {
      if (j !== i) {
        this.checkUpdate[j] = false;
      }
    }
    this.checkUpdate[i] = true;
  }

  saveAttractionType() {
    if (this.attractionTypeForm.valid) {
      this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນປະເພດສະຖານທີ່ທ່ອງທ່ຽວນີ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Insert'
      }).subscribe((res) => {
        if (res) {
          this.attractionsService.insertAttractionsType(this.attractionTypeForm.value).subscribe((new_type) => {
            this.attractions_types.push(new_type.json()['data']);
            this.attractionTypeForm.reset();
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

  updateType(i) {
    if (this.new_name.trim()) {
      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນປະເພດສະຖານທີ່ທ່ອງທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          const data = {
            att_type_id: this.attractions_types[i]['_id'],
            att_type_name: this.new_name
          };
          this.attractionsService.updateAttractionsType(data).subscribe((updated_type) => {
            this.attractions_types[i]['name'] = this.new_name;
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
    this.coolDialogs.confirm(`ລົບຂໍ້ມູນປະເພດສະຖານທີ່ທ່ອງທ່ຽວນີ້ແທ້ ຫຼື ບໍ?
                            (ຖ້າລົບ ສະຖານທີ່ທ່ອງທ່ຽວທັງໝົດຂອງປະເພດນີ້ຈະຖືກລົບໄປດ້ວຍ)`, {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ບັນທືກ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.attractionsService.deleteAttractionsType(id).subscribe((success) => {
          this.attractions_types.splice(i, 1);
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
