import { Component, OnInit } from '@angular/core';
import { } from 'morris.js';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {


  donutChart: morris.DonutChart;
  constructor() { }

  ngOnInit() {
    this.donutChart = Morris.Donut({
      element: 'sales-chart',
      resize: true,
      colors: ['#3c8dbc', '#f56954', '#00a65a'],
      data: [
        { label: 'ເພີ່ມຂໍ້ມູນ', value: 49 },
        { label: 'ແກ້ໄຂຂໍ້ມູນ', value: 30 },
        { label: 'ລົບຂໍ້ມູນ', value: 20 }
      ],
    });
  }

}
