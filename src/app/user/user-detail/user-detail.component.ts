import { StaticFunc } from './../../function-usages/static.func';
import { UserService } from './../../services/user.service';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { Router, ActivatedRoute } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Component, OnInit } from '@angular/core';
import { } from 'morris.js';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  user: Object = {};
  donutChart: morris.DonutChart;

  constructor(
    public progress: NgProgress,
    private router: Router,
    private query: ActivatedRoute,
    private coolDialogs: NgxCoolDialogsService,
    private userService: UserService
  ) {
    this.progress.start();
    query.params.subscribe((params) => {
      if (params.id) {
        const user_id = params.id;
        this.userService.getUser(user_id).subscribe((res) => {
          this.user = res.json()['data'];
          this.donutChart = Morris.Donut({
            element: 'sales-chart',
            resize: true,
            colors: ['#3c8dbc', '#f56954', '#00a65a'],
            data: [
              { label: 'ເພີ່ມຂໍ້ມູນ', value: this.user['managements']['_insert'].length },
              { label: 'ແກ້ໄຂຂໍ້ມູນ', value: this.user['managements']['_update'].length },
              { label: 'ລົບຂໍ້ມູນ', value: this.user['managements']['_delete'].length }
            ],
          });
        }, (error) => {
          if (error.status === 405) {
            this.coolDialogs.alert(error.json()['message'], {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Warning'
            }).subscribe((ok) => {
              localStorage.clear();
              this.router.navigate(['/login']);
            });
          } else if (error.status <= 423 && error.status >= 400) {
            this.coolDialogs.alert(error.json()['message'], {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Error'
            }).subscribe((ok) => {
              this.router.navigate(['/dashboard', 'user']);
            });
          } else {
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Error'
            }).subscribe((ok) => {
             this.router.navigate(['/dashboard', 'user']);
           });
          }
        });
      }
    });
  }

  ngOnInit() {
  }

  getImage(imageUrl) {
    if (navigator.onLine) {
      return imageUrl;
    }
    return 'assets/img/ic_user.jpg';
  }

  userPMS(pms: string) {
    return StaticFunc.userPMS(pms);
  }

  checkPermission(pms: string) {
    return StaticFunc.checkPms(pms);
  }

}
