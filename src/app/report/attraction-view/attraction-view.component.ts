import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-attraction-view',
  templateUrl: './attraction-view.component.html',
  styleUrls: ['./attraction-view.component.css']
})
export class AttractionViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  doPrint() {
    window.print();
  }

}
