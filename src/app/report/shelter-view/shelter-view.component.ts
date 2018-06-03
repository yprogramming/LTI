import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shelter-view',
  templateUrl: './shelter-view.component.html',
  styleUrls: ['./shelter-view.component.css']
})
export class ShelterViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  doPrint() {
    window.print();
  }

}
