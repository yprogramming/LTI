import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transportation-view',
  templateUrl: './transportation-view.component.html',
  styleUrls: ['./transportation-view.component.css']
})
export class TransportationViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  doPrint() {
    window.print();
  }

}
