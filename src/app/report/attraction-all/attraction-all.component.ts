import { Subscription } from 'rxjs/Subscription';
import { NgProgress } from 'ngx-progressbar';
import { ReportService } from './../../services/report.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-attraction-all',
  templateUrl: './attraction-all.component.html',
  styleUrls: ['./attraction-all.component.css']
})
export class AttractionAllComponent implements OnInit {
  attractionses_report: Array<Object> = [];
  constructor(
    public progress: NgProgress,
    private reportService: ReportService
  ) {
    this.progress.start();
    const reportSubscript: Subscription = this.reportService.getReportAttractionses().subscribe((report_res) => {
      this.attractionses_report = report_res.json()['data'];
      this.progress.done();
      reportSubscript.unsubscribe();
    }, (report_error) => {
      this.progress.done();
      reportSubscript.unsubscribe();
    });
   }

  ngOnInit() {
  }
  doPrint() {
    window.print();
  }

}
