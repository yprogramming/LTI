import { StaticFunc } from './../../function-usages/static.func';
import { RestaurantService } from './../../services/restaurant.service';
import { Router } from '@angular/router';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { NgProgress } from 'ngx-progressbar';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-food-type',
  templateUrl: './food-type.component.html',
  styleUrls: ['./food-type.component.css']
})
export class FoodTypeComponent implements OnInit {

  foodTypeForm: FormGroup;
  new_name: string;
  food_types: Array<Object> = [];

  checkUpdate: Array<boolean> = [];
  constructor(
    formBuilder: FormBuilder,
    public progress: NgProgress,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router,
    private restaurantService: RestaurantService
  ) {
    this.progress.start();
    this.foodTypeForm = formBuilder.group({
      food_type: ['', [Validators.required]]
    });
    this.restaurantService.getFoodTypes().subscribe((types) => {
      this.food_types = types.json()['data'];
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
    this.new_name = this.food_types[i]['name'];
    for (let j = 0; j < this.food_types.length; j++) {
      if (j !== i) {
        this.checkUpdate[j] = false;
      }
    }
    this.checkUpdate[i] = true;
  }

  saveFoodType() {
    if (this.foodTypeForm.valid) {
      this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນປະເພດອາຫານນີ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Insert'
      }).subscribe((res) => {
        if (res) {
          this.restaurantService.insertFoodType(this.foodTypeForm.value).subscribe((new_type) => {
            this.food_types.push(new_type.json()['data']);
            this.foodTypeForm.reset();
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
      StaticFunc.triggerForm(this.foodTypeForm);
    }
  }

  updateType(i) {
    if (this.new_name.trim()) {
      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນປະເພດອາຫານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          const data = {
            type_id: this.food_types[i]['_id'],
            type_name: this.new_name
          };
          this.restaurantService.updateFoodType(data).subscribe((updated_type) => {
            this.food_types[i]['name'] = this.new_name;
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
    this.coolDialogs.confirm(`ລົບຂໍ້ມູນປະເພດອາຫານນີ້ແທ້ ຫຼື ບໍ?`, {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.restaurantService.deleteFoodType(id).subscribe((success) => {
          this.food_types.splice(i, 1);
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
