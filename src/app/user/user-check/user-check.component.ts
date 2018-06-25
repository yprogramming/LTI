import { StaticFunc } from './../../function-usages/static.func';
import { UserService } from './../../services/user.service';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { NgProgress } from 'ngx-progressbar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-user-check',
  templateUrl: './user-check.component.html',
  styleUrls: ['./user-check.component.css']
})
export class UserCheckComponent implements OnInit {

  user: Object = {};
  checkDatas: Array<Object> = [];
  title: String = null;
  command: String = null;
  constructor(
    public progress: NgProgress,
    private router: Router,
    private query: ActivatedRoute,
    private coolDialogs: NgxCoolDialogsService,
    private userService: UserService
  ) {
    this.progress.start();
    query.queryParamMap.subscribe((paramMaps: ParamMap) => {
      if (paramMaps.get('c')) {
        const cmd = paramMaps.get('c');
        switch (cmd) {
          case 'ad' : {
            this.title = 'ເພີ່ມຂໍ້ມູນ';
            this.command = 'ເພີ່ມໃໝ່';
            this.queryRightData('ad');
            break;
          }
          case 'ed' : {
            this.title = 'ແກ້ໄຂຂໍ້ມູນ';
            this.command = 'ຖືກແກ້ໄຂ';
            this.queryRightData('ed');
            break;
          }
          case 'de' : {
            this.title = 'ລົບຂໍ້ມູນ';
            this.command = 'ຖືກລົບອອກ';
            this.queryRightData('de');
            break;
          }
          default : {
            this.router.navigate(['/dashboard', 'user']);
          }
        }
      } else {
        this.router.navigate(['/dashboard', 'user']);
      }
    });
   }

  ngOnInit() {
  }

  queryRightData(checkCondition: string) {
    this.query.params.subscribe((params) => {
      if (params.id) {
        const user_id = params.id;
        this.userService.getUser(user_id).subscribe((res) => {
          this.user = res.json()['data'];
          if (checkCondition === 'ad') {
            this.checkDatas = this.user['managements']['_insert'];
          } else if (checkCondition === 'ed') {
            this.checkDatas = this.user['managements']['_update'];
          } else if (checkCondition === 'de') {
            this.checkDatas = this.user['managements']['_delete'];
          }
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

