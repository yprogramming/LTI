import { StaticFunc } from './../../function-usages/static.func';
import { NgProgress } from 'ngx-progressbar';
import { UserService } from './../../services/user.service';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  test = 5;
  users: Array<Object> = [];
  constructor(
    public progress: NgProgress,
    private router: Router,
    private coolDialogs: NgxCoolDialogsService,
    private userService: UserService
  ) {
    this.progress.start();
    this.userService.getUsers().subscribe((res) => {
      this.users = res.json()['data'];
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
        this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນຈາກເຊີເວີ', {
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

  navigateUserDetail(userid: String) {
    this.router.navigate(['/dashboard', 'user', 'detail', userid]);
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
