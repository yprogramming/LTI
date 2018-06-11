import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class AttractionsService {
  constructor(
    private http: Http
  ) { }

  getAttractionses() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/attractions', option);
  }

  getAttractionsTypes() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/attractions/type', option);
  }

  getAttractions(attractions_id) {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/attractions/' + attractions_id, option);
  }

  insertAttractions(attractions_info: Object, imageUrls: Array<string>) {
    const data = {};
    Object.keys(attractions_info).forEach((key) => {
      data[key] = attractions_info[key];
    });
    data['images'] = imageUrls;

    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/attractions/insert', data, option);

  }

  insertAttractionsType(attractions_type: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/attractions/type/insert', attractions_type, option);
  }

  insertSocial(attractions_new_social: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/attractions/add/social', attractions_new_social, option);
  }

  insertImage(attractions_new_image: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/attractions/add/image', attractions_new_image, option);
  }

  updateAttractions(attractions_update_info: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/attractions/update', attractions_update_info, option);
  }

  updateAttractionsType(attractions_type: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/attractions/type/update', attractions_type, option);
  }

  updateAddress(attractions_new_address: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/attractions/update/address', attractions_new_address, option);
  }

  updateSocial(attractions_new_social: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/attractions/update/social', attractions_new_social, option);
  }

  deleteAttractions(attractions_id: string) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.delete(environment.SERVER_ADDRESS
                            + '/api/attractions/delete/'
                            + attractions_id, option);
  }

  deleteAttractionsType(att_type_id: string) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.delete(environment.SERVER_ADDRESS
                            + '/api/attractions/type/delete/'
                            + att_type_id, option);
  }

  deleteImage(del_image: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.post(environment.SERVER_ADDRESS + '/api/attractions/delete/image', del_image, option);
  }

  deleteSocial(del_social: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.delete(environment.SERVER_ADDRESS
                            + '/api/attractions/delete/'
                            + del_social['att_id']
                            + '/social/'
                            + del_social['social_id'], option);
  }

}
