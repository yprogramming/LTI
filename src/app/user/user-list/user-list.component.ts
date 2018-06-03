import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  test = 5;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  navigateUserDetail(userid: String) {
    this.router.navigate(['/dashboard', 'user', 'detail', userid]);
  }

}
