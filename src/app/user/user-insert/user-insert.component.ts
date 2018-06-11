import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { StaticFunc } from './../../function-usages/static.func';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailValidators, PasswordValidators } from 'ngx-validators';

@Component({
  selector: 'app-user-insert',
  templateUrl: './user-insert.component.html',
  styleUrls: ['./user-insert.component.css']
})
export class UserInsertComponent implements OnInit {

  // Image cropper
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  data: any;
  cropperSettings: CropperSettings;
  cropImageChecked: Boolean = false;
  uploadImageChecked: Boolean = false;
  savingChecked: Boolean = false;
  savedChecked: Boolean = false;

  // Upload
  uploadPercent: any;
  imageUploadMessage: string;
  errorMessage: String = null;

  // Form
  userForm: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage,
    private firebaseStorageRef: AngularFireStorage,
    private coolDialogs: NgxCoolDialogsService,
    private userService: UserService,
    private router: Router
  ) {
    // Create form
    this.userForm = formBuilder.group({
      user_name: [null, [Validators.required]],
      user_email: [null, [Validators.required, EmailValidators.simple]],
      user_pass: [null,
        [
          Validators.required,
          Validators.minLength(8),
          PasswordValidators.alphabeticalCharacterRule(1),
          PasswordValidators.digitCharacterRule(1)
        ]
      ],
      user_confirm: [null, [Validators.required]],
      user_permission: [null, [Validators.required]],
      user_profile: [null]
    });
    this.userForm.setValidators(PasswordValidators.mismatchedPasswords('user_pass', 'user_confirm'));

    // Setting image cropper
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 500;
    this.cropperSettings.height = 500;
    this.cropperSettings.croppedWidth = 500;
    this.cropperSettings.croppedHeight = 500;
    this.cropperSettings.canvasWidth = 500;
    this.cropperSettings.canvasHeight = 500;
    this.data = {};
  }

  ngOnInit() {
  }

  fileChangeListener($event) {
    let image = new Image();
    let file = $event.target.files[0];
    let myReader = new FileReader();
    let that = this;
    myReader.onloadend = function (loadEvent: any) {
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
    this.cropImageChecked = true;
  }

  cancelCrop() {
    this.data = {};
    this.cropImageChecked = false;
  }

  croppedImage() {
    const newImage = this.data.image;
    this.userForm.get('user_profile').setValue(newImage);
    this.data = {};
    this.cropImageChecked = false;
  }

  saveUser() {
    if (this.userForm.valid) {
      this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນຜູ້ໃຊ້ນີ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Register'
      }).subscribe((res) => {
        if (res) {
          if (this.userForm.value['user_profile']) {
            this.imageUploadMessage = 'ກະລຸນາລໍຖ້າ...';
            this.uploadImageChecked = true;
            this.uploadPercent = 0;

            const image = this.userForm.value['user_profile']; // ເອົາຮູບຈາກຟອມມາເກັບໄວ້
            const imageObject = image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
            const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
            const userStorage =  this.firebaseStorage.ref('Users');
            const imageUploading = userStorage.child(imageName).putString(image, 'data_url');
            imageUploading.percentageChanges().subscribe((percent) => {
              this.uploadPercent = percent;
              if (percent === 100) {
                setTimeout(() => {
                  this.savingChecked = true;
                  this.imageUploadMessage = 'ກຳລັງບັນທືກ...';
                  const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Users/' + imageName);
                  imageUrl.getDownloadURL().subscribe((url) => {
                    const profile_url = url;
                    const user_data = {
                      user_name: this.userForm.value['user_name'],
                      user_email: this.userForm.value['user_email'],
                      user_pass: this.userForm.value['user_pass'],
                      user_permission: this.userForm.value['user_permission'],
                      user_profile: url
                    };
                    this.userService.registerUser(user_data).subscribe((success) => {
                      this.savingChecked = false;
                      this.savedChecked = true;
                      setTimeout(() => {
                        this.savedChecked = false;
                        this.uploadImageChecked = false;
                        this.userForm.reset();
                      }, 3000);
                    }, (error) => {
                      if (error.status === 410) {
                        localStorage.clear();
                        this.coolDialogs.alert(error.json()['message'], {
                          theme: 'material', // available themes: 'default' | 'material' | 'dark'
                          okButtonText: 'OK',
                          color: 'black',
                          title: 'Warning'
                        }).subscribe((ok) => {
                          this.router.navigate(['/login']);
                        });
                      } else if (error.status <= 423 && error.status >= 400) {
                        try {
                          const message = error.json()['message'];
                          this.errorMessage = message;
                        } catch (err) {
                          this.errorMessage = 'ບໍ່ສາມາດສ້າງບັນຊີຜູ້ໃຊ້ໄດ້';
                        }
                        // setTimeout(() => this.errorMessage = null, 7000);
                      } else {
                        this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງສົ່ງຂໍ້ມູນຫາເຊີເວີ', {
                          theme: 'material', // available themes: 'default' | 'material' | 'dark'
                          okButtonText: 'OK',
                          color: 'black',
                          title: 'Error'
                        });
                      }
                      this.savingChecked = false;
                      this.savedChecked = false;
                      this.uploadImageChecked = false;
                    });
                  }, (error) => {
                    this.errorMessage = 'ມີບັນຫາໃນຂະນະອັບໂຫຼດຮູບ';
                    this.savingChecked = false;
                    this.savedChecked = false;
                    this.uploadImageChecked = false;
                  });
                }, 4000);
              }
            }, (error) => {
              this.errorMessage = 'ມີບັນຫາໃນຂະນະອັບໂຫຼດຮູບ';
              this.savingChecked = false;
              this.savedChecked = false;
              this.uploadImageChecked = false;
            });
          } else {
            this.savingChecked = true;
            const user_data = {
              user_name: this.userForm.value['user_name'],
              user_email: this.userForm.value['user_email'],
              user_pass: this.userForm.value['user_pass'],
              user_permission: this.userForm.value['user_permission']
            };
            this.userService.registerUser(user_data).subscribe((success) => {
              this.savingChecked = false;
              this.savedChecked = true;
              setTimeout(() => {
                this.savedChecked = false;
                this.userForm.reset();
              }, 4000);
            }, (error) => {
              if (error.status === 410) {
                localStorage.removeItem('lt_token');
               this.coolDialogs.alert(error.json()['message'], {
                  theme: 'material', // available themes: 'default' | 'material' | 'dark'
                  okButtonText: 'OK',
                  color: 'black',
                  title: 'Error'
                }).subscribe((ok) => {
                  this.router.navigate(['/login']);
                });
              } else if (error.status <= 423 && error.status >= 400) {
                try {
                  const message = error.json()['message'];
                  this.errorMessage = message;
                } catch (err) {
                  this.errorMessage = 'ບໍ່ສາມາດສ້າງບັນຊີຜູ້ໃຊ້ໄດ້';
                }
                // setTimeout(() => this.errorMessage = null, 7000);
              } else {
                this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງສົ່ງຂໍ້ມູນຫາເຊີເວີ', {
                  theme: 'material', // available themes: 'default' | 'material' | 'dark'
                  okButtonText: 'OK',
                  color: 'black',
                  title: 'Error'
                });
              }
              this.savingChecked = false;
              this.savedChecked = false;
              this.uploadImageChecked = false;
            });
          }
        } else {
          // cancle logic goes here
        }
      });
    } else {
      StaticFunc.triggerForm(this.userForm);
    }
  }
}
