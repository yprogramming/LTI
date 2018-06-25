import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class InternetService {

  constructor(
    private http: Http
  ) { }

  getInternets() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/internet', option);
  }

  getInternet(internet_id) {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/internet/' + internet_id, option);
  }

  insertInternet(internet_info: Object, imageUrls: Array<string>) {
    const data = {};
    Object.keys(internet_info).forEach((key) => {
      data[key] = internet_info[key];
    });
    data['images'] = imageUrls;

    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/internet/insert', data, option);

  }

  insertSocial(internet_new_social: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/internet/add/social', internet_new_social, option);
  }

  insertImage(internet_new_image: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/internet/add/image', internet_new_image, option);
  }

  updateInternet(internet_update_info: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/internet/update', internet_update_info, option);
  }

  updateAddress(internet_new_address: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/internet/update/address', internet_new_address, option);
  }

  updateSocial(internet_new_social: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/internet/update/social', internet_new_social, option);
  }

  deleteInternet(internet_id: string) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.delete(environment.SERVER_ADDRESS
                            + '/api/internet/delete/'
                            + internet_id, option);
  }

  deleteImage(del_image: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.post(environment.SERVER_ADDRESS + '/api/internet/delete/image', del_image, option);
  }

  deleteSocial(del_social: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.delete(environment.SERVER_ADDRESS
                            + '/api/internet/delete/'
                            + del_social['int_id']
                            + '/social/'
                            + del_social['social_id'], option);
  }
}
