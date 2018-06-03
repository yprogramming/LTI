import { StaticFunc } from './../function-usages/static.func';
import { EmailValidators } from 'ngx-validators';
import { UserService } from './../services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgProgress } from 'ngx-progressbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  existUsers: Boolean = false;
  errorMessage: String = null;
  checkSumit: Boolean = false;
  loginForm: FormGroup;
  constructor(
    formBuilder: FormBuilder,
    public progress: NgProgress,
    private loginService: UserService,
    private router: Router
  ) {
    this.loginForm = formBuilder.group({
      user_email: ['', [Validators.required, EmailValidators.simple]],
      user_pass: ['', [Validators.required, Validators.minLength(8)]]
    });
    progress.start();
    loginService.getLength().subscribe((data) => {
      if (data.status === 204) {
        this.existUsers =  true;
        localStorage.setItem('lti_exist', 'false');
      } else {
        this.existUsers = false;
        localStorage.setItem('lti_exist', 'true');
      }
      this.progress.done();
    }, (error) => {
      this.existUsers = false;
      localStorage.setItem('lti_exist', 'true');
      this.progress.done();
    });
  }

  ngOnInit() {
  }

  doLogin() {
    if (this.loginForm.valid) {
      this.checkSumit = true;
      this.loginService.loginUser(this.loginForm.value).subscribe((data) => {
        const lg_user = data.json();
        lg_user['data']['lg_date'] = new Date();
        const lt_token = {
          token: lg_user['token'],
          data: lg_user['data']
        };
        localStorage.setItem('lt_token', JSON.stringify(lt_token));
        this.router.navigate(['/dashboard']);
      }, (error) => {
        if (error['status'] === 400) {
          const err = error.json();
          this.errorMessage = err['message'];
        } else {
          this.errorMessage = 'ບໍ່ສາມາດເຂົ້າສູ່ລະບົບໄດ້ໃນຂະນະນີ້';
        }
        this.checkSumit = false;
      });
    } else {
      StaticFunc.triggerForm(this.loginForm);
    }
  }

}
