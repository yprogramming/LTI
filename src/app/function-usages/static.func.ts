import { BackwardString } from './backward.string';
import { RandomString } from './random.string';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ForwardString } from './forward.string';
export class StaticFunc {
  static ramdomText() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ$abcdefghijklmnopqrstuvwxyz_0123456789';
    for (let i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  static triggerForm(form: FormGroup) {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if ( control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
        control.markAsDirty({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.triggerForm(control);
      } else if (control instanceof FormArray) {
        const formArray: FormArray = <FormArray> control;
        for (let i = 0; i < formArray.length; i++) {
          if (formArray.controls[i] instanceof FormControl) {
            formArray.controls[i].markAsTouched({onlySelf: true});
            formArray.controls[i].markAsDirty({onlySelf: true});
          } else if (formArray.controls[i] instanceof FormGroup) {
            this.triggerForm(<FormGroup> formArray.controls[i]);
          }
        }
      }
    });
  }

  static encoding(str: string) {
    const generateString = RandomString.randomText();
    const combine = str + generateString;
    return ForwardString.forward(ForwardString.forward(ForwardString.forward(combine)));
  }

  static decoding(str: string) {
    const combind = BackwardString.backward(BackwardString.backward(BackwardString.backward(str)));
    return combind.slice(0, combind.length - 50);
  }

  static en_normal(str: string) {
    return ForwardString.forward(ForwardString.forward(ForwardString.forward(str)));
  }

  static de_normal(str: string) {
    return BackwardString.backward(BackwardString.backward(BackwardString.backward(str)));
  }

  static en_fixed_string(str: string) {
    const combine = str + 'kow9lx1qef7s3smd4dw8pr5ax0nd6gswdkiwoxeuzbsljdpmsw';
    return ForwardString.forward(ForwardString.forward(ForwardString.forward(combine)));
  }

  static userPMS(str: string) {
    if (this.decoding(str) === 'master') {
      return 'ຜູ້ບໍລິຫານລະບົບ';
    } else if (this.decoding(str) === 'admin') {
      return 'ຜູ້ບໍລິຫານໜ່ວຍງານ IT';
    }
    return 'ພະນັກງານ IT';
  }

  static userMst(str: string) {
    if (this.decoding(str) === 'master') {
      return true;
    }
    return false;
  }

  static checkPms(str: string) {
    if (this.decoding(str) === 'admin') {
      return true;
    }
    return false;
  }

  static published(pb: boolean) {
    const user = JSON.parse(localStorage.getItem('lt_token'));
    const permission = user.data['user_pms'];
    if ((this.decoding(permission) === 'master') && !pb) {
      return true;
    }
    return false;
  }

}
