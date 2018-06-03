import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-attraction-all',
  templateUrl: './attraction-all.component.html',
  styleUrls: ['./attraction-all.component.css']
})
export class AttractionAllComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  doPrint() {
    window.print();
  }

}
