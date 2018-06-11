import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class CompanyService {

  constructor(
    private http: Http
  ) { }

  getTourCompanies() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/company', option);
  }

  getTourCompany(company_id) {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/company/' + company_id, option);
  }

  insertTourCompany(company_info: Object, imageUrls: Array<string>) {
    const data = {};
    Object.keys(company_info).forEach((key) => {
      data[key] = company_info[key];
    });
    data['images'] = imageUrls;

    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/company/insert', data, option);

  }

  insertSocial(company_new_social: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/company/add/social', company_new_social, option);
  }

  insertImage(company_new_image: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/company/add/image', company_new_image, option);
  }

  updateTourCompany(company_update_info: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/company/update', company_update_info, option);
  }

  updateAddress(company_new_address: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/company/update/address', company_new_address, option);
  }

  updateSocial(company_new_social: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/company/update/social', company_new_social, option);
  }

  deleteInternet(company_id: string) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.delete(environment.SERVER_ADDRESS
                            + '/api/company/delete/'
                            + company_id, option);
  }

  deleteImage(del_image: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.post(environment.SERVER_ADDRESS + '/api/company/delete/image', del_image, option);
  }

  deleteSocial(del_social: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.delete(environment.SERVER_ADDRESS
                            + '/api/company/delete/'
                            + del_social['com_id']
                            + '/social/'
                            + del_social['social_id'], option);
  }

}
