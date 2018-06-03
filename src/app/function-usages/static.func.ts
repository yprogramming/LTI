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
        for (let i = 0; i < control.length; i++) {
          if (control[i] instanceof FormControl) {
            control[i].markAsTouched({onlySelf: true});
            control[i].markAsDirty({onlySelf: true});
          } else if (control[i] instanceof FormGroup) {
            this.triggerForm(control[i]);
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
    return ForwardString.forward(ForwardString.forward(ForwardString.forward(str)));
  }

}
