import { NgProgress } from 'ngx-progressbar';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {

  constructor(
    public progress: NgProgress
  ) {
    progress.start();
   }

  ngOnInit() {
    setTimeout(() => {
      this.progress.done();
    }, 4000);
  }

}
