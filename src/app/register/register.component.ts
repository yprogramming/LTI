import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { Component, OnInit, trigger } from '@angular/core';
import { FormGroup, FormBuilder, Validators, EmailValidator, FormControl, FormArray } from '@angular/forms';
import { PasswordValidators, EmailValidators } from 'ngx-validators';
import { Subscription } from 'rxjs/Subscription';
import { StaticFunc } from '../function-usages/static.func';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  checkSumit: Boolean = false;
  errorMessage: String = null;
  registerForm: FormGroup;
  subscription: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private registerService: UserService,
    private router: Router,
    private coolDialogs: NgxCoolDialogsService
  ) {
    this.registerForm = formBuilder.group({
      u_fullname: ['', [Validators.required]],
      u_email: ['', [Validators.required, EmailValidators.simple]],
      u_pass: ['', [
          Validators.required,
          Validators.minLength(8),
          PasswordValidators.alphabeticalCharacterRule(1),
          PasswordValidators.digitCharacterRule(1)
        ]
      ],
      u_confirm: ['', [Validators.required]]
    });
    this.registerForm.setValidators(PasswordValidators.mismatchedPasswords('u_pass', 'u_confirm'));
   }

  ngOnInit() {
  }

  doRegister() {
    if (this.registerForm.valid) {
      const data = {
        user_name: this.registerForm.value['u_fullname'],
        user_email: this.registerForm.value['u_email'],
        user_pass: this.registerForm.value['u_pass'],
      };
      this.checkSumit = true;
      this.subscription = this.registerService.registerAdmin(data).subscribe((success) => {
        // Success logic goes here
        const alertSubscription: Subscription = this.coolDialogs.alert('ສ້າງຜູ້ຄວບຄຸມລະບົບສຳເລັດແລ້ວ', {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Register'
        }).subscribe((res) => {
          localStorage.setItem('lti_exist', 'true');
          this.router.navigate(['/login']);
          this.registerForm.reset();
          alertSubscription.unsubscribe();
          this.checkSumit = false;
        });
        this.subscription.unsubscribe();
      }, (error) => {
        try {
          const err = error.json();
          this.errorMessage = err.message;
          setTimeout(() => this.errorMessage = null, 4000);
        } catch (err) {
          this.router.navigate(['/login']);
        }
        this.subscription.unsubscribe();
      });
    } else {
      StaticFunc.triggerForm(this.registerForm);
    }
  }

}
