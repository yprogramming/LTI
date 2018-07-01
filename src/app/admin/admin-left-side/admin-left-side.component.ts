import { Router, NavigationEnd } from '@angular/router';
import { StaticFunc } from './../../function-usages/static.func';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-left-side',
  templateUrl: './admin-left-side.component.html',
  styleUrls: ['./admin-left-side.component.css']
})
export class AdminLeftSideComponent implements OnInit {

  user: Object;
  constructor(
    private router: Router,
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if (localStorage.getItem('lt_token')) {
          this.user = JSON.parse(localStorage.getItem('lt_token'))['data'];
        }
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

  en_user_id(id: string) {
    return StaticFunc.en_normal(id);
  }

  checkUserPms() {
    if (
      (this.user['user_pms'] === StaticFunc.en_fixed_string('master'))
      ||
      (this.user['user_pms'] === StaticFunc.en_fixed_string('admin'))
    ) {
      return true;
    }
    return false;
  }

}
