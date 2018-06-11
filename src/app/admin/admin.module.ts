import { DashboardService } from './../services/dashboard.service';
import { TooltipModule } from 'ngx-tooltip';
import { NgProgressModule } from 'ngx-progressbar';
import { UserProfileComponent } from './../user-profile/user-profile.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UserModule } from './../user/user.module';
import { AdminRoutingModule } from './admin-routing/admin-routing.module';

import { AdminDashboard1Component } from './admin-dashboard1/admin-dashboard1.component';
import { AdminControlSidebarComponent } from './admin-control-sidebar/admin-control-sidebar.component';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { AdminContentComponent } from './admin-content/admin-content.component';
import { AdminLeftSideComponent } from './admin-left-side/admin-left-side.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminComponent } from './admin.component';
import { ReportModule } from '../report/report.module';
import { RouterModule } from '@angular/router';

const admin_component = [
  AdminComponent,
  AdminHeaderComponent,
  AdminLeftSideComponent,
  AdminContentComponent,
  AdminFooterComponent,
  AdminControlSidebarComponent,
  AdminDashboard1Component,
  UserProfileComponent
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    NgProgressModule,
    TooltipModule
  ],
  declarations: [
    ...admin_component
  ],
  providers: [DashboardService]
})
export class AdminModule { }
