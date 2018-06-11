import { StaticFunc } from './../function-usages/static.func';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: Object;
  constructor() { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('lt_token'))['data'];
  }

  userPMS() {
    return StaticFunc.userPMS(this.user['user_pms']);
  }

}
