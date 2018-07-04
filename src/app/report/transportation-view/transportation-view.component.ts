import { Subscription } from 'rxjs/Subscription';
import { ReportService } from './../../services/report.service';
import { NgProgress } from 'ngx-progressbar';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transportation-view',
  templateUrl: './transportation-view.component.html',
  styleUrls: ['./transportation-view.component.css']
})
export class TransportationViewComponent implements OnInit {

  transportation_views_report: Array<Object> = [];
  constructor(
    public progress: NgProgress,
    private reportService: ReportService
  ) {
    this.progress.start();
    const reportSubscript: Subscription = this.reportService.getReportTransportationViews().subscribe((report_res) => {
      this.transportation_views_report = report_res.json()['data'];
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
