import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DashboardService } from './../../services/dashboard.service';
import { NgProgress } from 'ngx-progressbar';
import { Component, OnInit } from '@angular/core';
import { } from 'jquery';
import { } from 'morris.js';
import { } from 'jquery-knob';
import { } from 'bootstrap-datepicker';
import { } from 'jqueryui';
import { } from 'daterangepicker';
import { } from 'jquery.slimscroll';
import * as moment from 'moment';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
// Variable in assets/js/scripts.js file
declare var AdminLTE: any;

@Component({
  selector: 'app-admin-dashboard1',
  templateUrl: './admin-dashboard1.component.html',
  styleUrls: ['./admin-dashboard1.component.css']
})
export class AdminDashboard1Component implements OnInit {
  linechart: morris.GridChart;
  areaChart: morris.GridChart;
  donutChart: morris.DonutChart;
  knob: JQuery;
  calendar: JQuery;


  // variable
  allPlacesCount: {
    attractions: {
      length: number,
      data: Array<Object>
    },
    restaurants: {
      length: number,
      data: Array<Object>
    },
    shelters: {
      length: number,
      data: Array<Object>
    },
    transportations: {
      length: number,
      data: Array<Object>
    }
  };

  constructor(
    public progress: NgProgress,
    private dashboardService: DashboardService,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router
  ) {
    this.allPlacesCount = {
      attractions: {
        length: 0,
        data: []
      },
      restaurants: {
        length: 0,
        data: []
      },
      shelters: {
        length: 0,
        data: []
      },
      transportations: {
        length: 0,
        data: []
      }
    };
    progress.start();
    dashboardService.allPlaceLength().subscribe((data) => {
      const places = data.json();
      this.allPlacesCount = places['data'];
      this.progress.done();
    }, (error) => {
      this.progress.done();
      if (error.status === 405) {
        const alertSubscription: Subscription = this.coolDialogs.alert(error.json()['message'], {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Warning'
        }).subscribe((res) => {
          localStorage.clear();
          this.router.navigate(['/login']);
          alertSubscription.unsubscribe();
        });
      } else if (error.status <= 423 && error.status >= 400) {
        this.coolDialogs.alert(error.json()['message'], {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Error'
        });
      } else {
        this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Error'
        });
      }
    });
  }
  ngOnInit() {
     // Update the AdminLTE layouts
    AdminLTE.init();
    // Make the dashboard widgets sortable Using jquery UI
    jQuery('.connectedSortable').sortable({
      placeholder: 'sort-highlight',
      connectWith: '.connectedSortable',
      handle: '.box-header, .nav-tabs',
      forcePlaceholderSize: true,
      zIndex: 999999
    });
    jQuery('.connectedSortable .box-header, .connectedSortable .nav-tabs-custom').css('cursor', 'move');

    // jQuery UI sortable for the todo list
    // jQuery('.todo-list').sortable({
    //   placeholder: 'sort-highlight',
    //   handle: '.handle',
    //   forcePlaceholderSize: true,
    //   zIndex: 999999
    // });

    // bootstrap WYSIHTML5 - text editor
    // jQuery('.textarea').wysihtml5();

    // jQuery('.daterange').daterangepicker({
    //   ranges: {
    //     'Today': [moment(), moment()],
    //     'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    //     'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    //     'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    //     'This Month': [moment().startOf('month'), moment().endOf('month')],
    //     'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    //   },
    //   startDate: moment().subtract(29, 'days'),
    //   endDate: moment()
    // }, function (start, end) {
    //   // window.alert('You chose:  ' + this.start.format('MMMM D, YYYY') + ' - ' + this.end.format('MMMM D, YYYY'));
    // });


    // this.knob = jQuery('.knob').knob();
    // this.calendar = jQuery('#calendar').datepicker();

    // // SLIMSCROLL FOR CHAT WIDGET
    // jQuery('#chat-box').slimScroll({
    //   height: '250px'
    // });

    this.areaChart = Morris.Area({
      element: 'revenue-chart',
      resize: true,
      data: [

        { y: '2008 (ປີ)', item1: 5073, item2: 5967, item3: 3221, item4: 3221 },
        { y: '2009 (ປີ)', item1: 4687, item2: 4460, item3: 3482, item4: 3221 },
        { y: '2010 (ປີ)', item1: 8432, item2: 5713, item3: 2314, item4: 3221 },
        { y: '2011 (ປີ)', item1: 2666, item2: 2666, item3: 2235, item4: 3221 },
        { y: '2012 (ປີ)', item1: 2778, item2: 2294, item3: 1223, item4: 3221 },
        { y: '2013 (ປີ)', item1: 4912, item2: 1969, item3: 1323, item4: 3221 },
        { y: '2014 (ປີ)', item1: 3767, item2: 3597, item3: 3324, item4: 3221 },
        { y: '2015 (ປີ)', item1: 6810, item2: 1914, item3: 3342, item4: 3221 },
        { y: '2016 (ປີ)', item1: 5670, item2: 4293, item3: 2314, item4: 3221 },
        { y: '2017 (ປີ)', item1: 4820, item2: 3795, item3: 1231, item4: 3221 }
      ],
      xkey: 'y',
      ykeys: ['item1', 'item2', 'item3', 'item4'],
      labels: ['ສທ (ຄັ້ງ)', 'ຮຫ (ຄັ້ງ)', 'ທສ (ຄັ້ງ)', 'ສສ (ຄັ້ງ)'],
      lineColors: ['#00a65a', '#dd4b39', '#0073b7', '#f39c12'],
      hideHover: 'auto'
    });

    this.donutChart = Morris.Donut({
      element: 'sales-chart',
      resize: true,
      colors: ['#00a65a', '#dd4b39', '#0073b7', '#f39c12'],
      data: [
        { label: 'ສທ (ຄັ້ງ)', value: 12 },
        { label: 'ຮຫ (ຄັ້ງ)', value: 30 },
        { label: 'ທສ (ຄັ້ງ)', value: 20 },
        { label: 'ສສ (ຄັ້ງ)', value: 20 }
      ],
    });

    /*this.linechart = Morris.Line({
      element: 'line-chart',
      resize: true,
      data: [
        { y: '2011 Q1', item1: 2666 },
        { y: '2011 Q2', item1: 2778 },
        { y: '2011 Q3', item1: 4912 },
        { y: '2011 Q4', item1: 3767 },
        { y: '2012 Q1', item1: 6810 },
        { y: '2012 Q2', item1: 5670 },
        { y: '2012 Q3', item1: 4820 },
        { y: '2012 Q4', item1: 15073 },
        { y: '2013 Q1', item1: 10687 },
        { y: '2013 Q2', item1: 8432 }
      ],
      xkey: 'y',
      ykeys: ['item1'],
      labels: ['Item 1'],
      lineColors: ['#efefef'],
      lineWidth: 2,
      hideHover: 'auto',
      gridTextColor: '#fff',
      gridStrokeWidth: 0.4,
      pointSize: 4,
      pointStrokeColors: ['#efefef'],
      gridLineColor: '#efefef',
      gridTextFamily: 'Open Sans',
      gridTextSize: 10
    });*/

    /* The todo list plugin */
    /*
    jQuery('.todo-list').todolist({
      onCheck: function (ele) {
        window.console.log('The element has been checked');
        return ele;
      },
      onUncheck: function (ele) {
        window.console.log('The element has been unchecked');
        return ele;
      }
    });*/

  }

}
