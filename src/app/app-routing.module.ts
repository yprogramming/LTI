import { LoginService } from './auth-guard/login.service';
import { AnotherComponent } from './another/another.component';
import { TourCompanyComponent } from './tour-company/tour-company.component';
import { TransportationComponent } from './transportation/transportation.component';
import { ShelterComponent } from './shelter/shelter.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { AttractionsComponent } from './attractions/attractions.component';
import { AdminDashboard1Component } from './admin/admin-dashboard1/admin-dashboard1.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { RegisterService } from './auth-guard/register.service';
import { LoginedService } from './auth-guard/logined.service';

const routes: Routes = [
    {
        path: 'dashboard',
        loadChildren: 'app/admin/admin.module#AdminModule',
        canActivate: [LoginedService]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginService]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [RegisterService]
    },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
