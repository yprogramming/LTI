import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
 import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-user-check',
  templateUrl: './user-check.component.html',
  styleUrls: ['./user-check.component.css']
})
export class UserCheckComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  title: String = null;
  command: String = null;
  constructor(
    private route: Router,
    private query: ActivatedRoute
  ) {
    this.subscription = query.queryParamMap.subscribe((paramMaps: ParamMap) => {
      if (paramMaps.get('c')) {
        const cmd = paramMaps.get('c');
        switch (cmd) {
          case 'ad' : {
            this.title = 'ເພີ່ມຂໍ້ມູນ';
            this.command = 'ເພີ່ມໃໝ່';
            break;
          }
          case 'ed' : {
            this.title = 'ແກ້ໄຂຂໍ້ມູນ';
            this.command = 'ຖືກແກ້ໄຂ';
            break;
          }
          case 'de' : {
            this.title = 'ລົບຂໍ້ມູນ';
            this.command = 'ຖືກລົບອອກ';
            break;
          }
          default : {
            this.route.navigate(['/dashboard', 'user']);
          }
        }
      } else {
        this.route.navigate(['/dashboard', 'user']);
      }
    });
   }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

