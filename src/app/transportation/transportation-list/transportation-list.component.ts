import { TransportationService } from './../../services/transportation.service';
import { Router } from '@angular/router';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { NgProgress } from 'ngx-progressbar';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transportation-list',
  templateUrl: './transportation-list.component.html',
  styleUrls: ['./transportation-list.component.css']
})
export class TransportationListComponent implements OnInit {

  transportations: Array<Object> = [];
  constructor(
    public progress: NgProgress,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router,
    private transportationService: TransportationService
  ) {
    this.progress.start();
    this.transportationService.getTransportations().subscribe((trans) => {
      this.transportations = trans.json()['data'];
      this.progress.done();
    }, (error) => {
      if (error.status === 405) {
        this.coolDialogs.alert(error.json()['message'], {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Warning'
        }).subscribe(() => {
          localStorage.clear();
          this.router.navigate(['/login']);
        });
      } else if (error.status <= 423 && error.status >= 400) {
        this.coolDialogs.alert(error.json()['message'], {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Error'
        });
      } else {
        this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນຈາກເຊີເວີ', {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Error'
        });
      }
      this.progress.done();
    });
   }

  ngOnInit() {
  }

  getImage(imageUrl) {
    if (navigator.onLine) {
      return imageUrl;
    }
    return 'assets/img/ic_image.png';
  }

  checkTransportationLength() {
    if (this.transportations.length > 25) {
      return true;
    }
    return false;
  }

}
