import { RestaurantService } from './../../services/restaurant.service';
import { Router } from '@angular/router';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { NgProgress } from 'ngx-progressbar';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StaticFunc } from '../../function-usages/static.func';

@Component({
  selector: 'app-restaurant-type',
  templateUrl: './restaurant-type.component.html',
  styleUrls: ['./restaurant-type.component.css']
})
export class RestaurantTypeComponent implements OnInit {

  restaurantTypeForm: FormGroup;
  new_name: string;
  restaurant_types: Array<Object> = [];

  checkUpdate: Array<boolean> = [];
  constructor(
    formBuilder: FormBuilder,
    public progress: NgProgress,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router,
    private restaurantService: RestaurantService
  ) {
    this.progress.start();
    this.restaurantTypeForm = formBuilder.group({
      res_type_name: ['', [Validators.required]]
    });
    this.restaurantService.getRestaurantTypes().subscribe((types) => {
      this.restaurant_types = types.json()['data'];
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
    this.new_name = this.restaurant_types[i]['name'];
    for (let j = 0; j < this.restaurant_types.length; j++) {
      if (j !== i) {
        this.checkUpdate[j] = false;
      }
    }
    this.checkUpdate[i] = true;
  }

  saveRestaurantType() {
    if (this.restaurantTypeForm.valid) {
      this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນປະເພດຮ້ານອາຫານນີ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Insert'
      }).subscribe((res) => {
        if (res) {
          this.restaurantService.insertRestaurantType(this.restaurantTypeForm.value).subscribe((new_type) => {
            this.restaurant_types.push(new_type.json()['data']);
            this.restaurantTypeForm.reset();
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
      StaticFunc.triggerForm(this.restaurantTypeForm);
    }
  }

  updateType(i) {
    if (this.new_name.trim()) {
      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນປະເພດຮ້ານອາຫານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          const data = {
            res_type_id: this.restaurant_types[i]['_id'],
            res_type_name: this.new_name
          };
          this.restaurantService.updateRestaurantType(data).subscribe((updated_type) => {
            this.restaurant_types[i]['name'] = this.new_name;
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
    this.coolDialogs.confirm(`ລົບຂໍ້ມູນປະເພດຮ້ານອາຫານນີ້ແທ້ ຫຼື ບໍ?
                            (ຖ້າລົບ ຂໍ້ມູນຮ້ານອາຫານທັງໝົດຂອງປະເພດນີ້ຈະຖືກລົບໄປດ້ວຍ)`, {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.restaurantService.deleteRestaurantType(id).subscribe((success) => {
          this.restaurant_types.splice(i, 1);
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
