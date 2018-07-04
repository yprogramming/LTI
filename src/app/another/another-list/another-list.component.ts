import { Subscription } from 'rxjs/Subscription';
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

  search_keyword: string;
  another_places: Array<Object> = [];
  constructor(
    public progress: NgProgress,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router,
    private anotherService: AnotherService
  ) {
    this.progress.start();

    const anotherSubscript: Subscription = this.anotherService.getAnothers().subscribe((anothers) => {
      this.another_places = anothers.json()['data'];
      this.progress.done();
      anotherSubscript.unsubscribe();
    }, (error) => {
      if (error.status === 405) {
        const dialogSubscript: Subscription = this.coolDialogs.alert(error.json()['message'], {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Warning'
        }).subscribe(() => {
          localStorage.clear();
          dialogSubscript.unsubscribe();
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
      anotherSubscript.unsubscribe();
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

  checkAnotherLength() {
    if (this.another_places.length > 25) {
      return true;
    }
    return false;
  }

}
