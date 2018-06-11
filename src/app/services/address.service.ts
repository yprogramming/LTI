import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class AddressService {

  constructor(
    private http: Http
  ) { }

  getProvinces() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/address/province', option);
  }

  getDistricts(district_id) {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/address/district/' + district_id, option);
  }

  insertAddress(address: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/address/insert', address, option);
  }

  updateProvince(province: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/address/province/update', province, option);
  }

  updateDistrict(district: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/address/district/update', district, option);
  }

  updateVillage(village: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/address/village/update', village, option);
  }

  insertDistrict(district: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/address/district/insert', district, option);
  }

  insertVillage(village: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken', token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/address/village/insert', village, option);
  }

  deleteProvince(province_id) {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken', token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.delete(environment.SERVER_ADDRESS + '/api/address/province/delete/' + province_id, option);
  }

  deleteDistrict(district_id) {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken', token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.delete(environment.SERVER_ADDRESS + '/api/address/district/delete/' + district_id, option);
  }

  deleteVillage(village_id) {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken', token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.delete(environment.SERVER_ADDRESS + '/api/address/village/delete/' + village_id, option);
  }

}
