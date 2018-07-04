import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class ReportService {

  constructor(
    private http: Http
  ) { }

  getReportAttractionses() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/report/attractionses', option);
  }

  getReportAttractionsViews() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/report/attractions/count', option);
  }

  getReportRestaurantViews() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/report/restaurant/count', option);
  }

  getReportShelterViews() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/report/shelter/count', option);
  }

  getReportTransportationViews() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/report/transportation/count', option);
  }

  getReportCompanyViews() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/report/company/count', option);
  }

}
