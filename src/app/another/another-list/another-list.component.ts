import { Router } from '@angular/router';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { NgProgress } from 'ngx-progressbar';
import { Component, OnInit } from '@angular/core';
import { AnotherService } from '../../services/another.service';

@Component({
  selector: 'app-another-list',
  templateUrl: './another-list.component.html',
  styleUrls: ['./another-list.component.css']
})
export class AnotherListComponent implements OnInit {

  another_places: Array<Object> = [];
  constructor(
    public progress: NgProgress,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router,
    private anotherService: AnotherService
  ) {
    this.progress.start();

    this.anotherService.getAnothers().subscribe((anothers) => {
      this.another_places = anothers.json()['data'];
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

  checkAnotherLength() {
    if (this.another_places.length > 25) {
      return true;
    }
    return false;
  }

}
