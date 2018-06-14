import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class DashboardService {

  constructor(
    private http: Http
  ) { }

  allPlaceLength() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/dashboard', option);
  }

}
