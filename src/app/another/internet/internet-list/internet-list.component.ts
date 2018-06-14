import { Router } from '@angular/router';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { NgProgress } from 'ngx-progressbar';
import { Component, OnInit } from '@angular/core';
import { InternetService } from '../../../services/internet.service';

@Component({
  selector: 'app-internet-list',
  templateUrl: './internet-list.component.html',
  styleUrls: ['./internet-list.component.css']
})
export class InternetListComponent implements OnInit {

  internet_centers: Array<Object> = [];
  constructor(
    public progress: NgProgress,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router,
    private internetService: InternetService
  ) {

    this.progress.start();

    this.internetService.getInternets().subscribe((internets) => {
      this.internet_centers = internets.json()['data'];
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

  checkInternetLength() {
    if (this.internet_centers.length > 25) {
      return true;
    }
    return false;
  }

}
