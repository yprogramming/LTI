import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UserService {

  constructor(
    private http: Http
  ) { }

  getUsers() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/user', option);
  }

  getUser(user_id: string) {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/user/detail/' + user_id, option);
  }

  getLength() {
    const header: Headers = new Headers();
    header.append('lttoken',  bcrypt.hashSync(environment.ANONYMOUS_SECRET, 10) );
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/user/length', option);
  }

  registerAdmin(user_info: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('lttoken',  bcrypt.hashSync(environment.ANONYMOUS_SECRET, 10) );
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/user/register/admin', user_info, option);
  }

  registerUser(user_info: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.put(environment.SERVER_ADDRESS + '/api/user/register/user', user_info, option);
  }

  loginUser(lg_info: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('lttoken',  bcrypt.hashSync(environment.ANONYMOUS_SECRET, 10) );
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.post(environment.SERVER_ADDRESS + '/api/user/login', lg_info, option);
  }

  logoutUser() {
    const header: Headers = new Headers();
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.get(environment.SERVER_ADDRESS + '/api/user/logout', option);
  }

  updateUser(user_info: Object) {
    const header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const token = `${user.token};${user.data.user_id}`;
    header.append('ltitoken',   token);
    const option: RequestOptions = new RequestOptions({headers: header});
    return this.http.patch(environment.SERVER_ADDRESS + '/api/user/update', user_info, option);
  }

}
