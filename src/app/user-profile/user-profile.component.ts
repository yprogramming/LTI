import { Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { StaticFunc } from './../function-usages/static.func';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {


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

  checkUpdateName = false;
  userNameUpdateForm: FormGroup;
  user: Object;
  constructor(
    formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage,
    private firebaseStorageRef: AngularFireStorage,
    private coolDialogs: NgxCoolDialogsService,
    private userService: UserService,
    private router: Router
  ) {
    this.userNameUpdateForm = formBuilder.group({
      fullname: [null, [Validators.required]]
    });

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
    this.user = JSON.parse(localStorage.getItem('lt_token'))['data'];
  }

  userPMS() {
    return StaticFunc.userPMS(this.user['user_pms']);
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
    this.coolDialogs.confirm('ອັບໂຫຼດ ແລະ ປ່ຽນຮູບໂປຣຟາຍລ໌ນີ້ແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ອັບໂຫຼດ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Add'
    }).subscribe((res) => {
      if (res) {
        this.uploadPercent = 0;
        this.uploadImageChecked = true;
        const new_image = this.data['image'];
        const userRef = this.firebaseStorage.ref('Users');
        const imageObject = new_image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
        const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
        const transportationUpload = userRef.child(imageName).putString(new_image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
        transportationUpload.percentageChanges().subscribe((percent) => {
          this.uploadPercent = percent;
          if (percent === 100) {
            setTimeout(() => {
              const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Users/' + imageName);  // ກຳໜົດ Reference
              imageUrl.getDownloadURL().subscribe((url) => {
                const image_url = url;
                this.uploadImageChecked = false;
                this.savingChecked = true;
                const data = {
                  title: 'ແກ້ໄຂຮູບໂປຣຟາຍລ໌',
                  _field: {
                    profile: image_url
                  }
                };

                this.userService.updateUser(data).subscribe((success) => {
                  this.savingChecked = false;
                  this.savedChecked = true;
                  setTimeout(() => {
                    const user_on_storage = JSON.parse(localStorage.getItem('lt_token'));
                    user_on_storage['data']['user_profile'] = image_url;
                    localStorage.setItem('lt_token', JSON.stringify(user_on_storage));
                    this.user['user_profile'] = image_url;
                    this.data = {};
                    this.savedChecked = false;
                    this.cropImageChecked = false;
                  }, 3000);
                }, (error) => {
                  if (error.status === 405) {
                    this.coolDialogs.alert(error.json()['message'], {
                      theme: 'material', // available themes: 'default' | 'material' | 'dark'
                      okButtonText: 'OK',
                      color: 'black',
                      title: 'Warning'
                    }).subscribe(() => {
                      localStorage.clear();
                      this.router.navigate(['/login']);
                    });
                  } else if (error.status <= 423 && error.status >= 400) {
                    this.coolDialogs.alert(error.json()['message'], {
                      theme: 'material', // available themes: 'default' | 'material' | 'dark'
                      okButtonText: 'OK',
                      color: 'black',
                      title: 'Error'
                    });
                  } else {
                    this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
                      theme: 'material', // available themes: 'default' | 'material' | 'dark'
                      okButtonText: 'OK',
                      color: 'black',
                      title: 'Error'
                    });
                  }
                });
              }, (error) => {
                this.coolDialogs.alert('ອັບໂຫຼດຮູບລົ້ມເຫຼວ', {
                  theme: 'material', // available themes: 'default' | 'material' | 'dark'
                  okButtonText: 'OK',
                  color: 'black',
                  title: 'Error'
                }).subscribe(() => {
                  this.uploadImageChecked = false;
                });
              });
            }, 3000);

          }
        }, (error) => {
          this.coolDialogs.alert('ອັບໂຫຼດຮູບລົ້ມເຫຼວ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Error'
          }).subscribe(() => {
            this.uploadImageChecked = false;
          });
        });
      }
    });
  }

  viewEditName() {
    this.userNameUpdateForm.get('fullname').setValue(this.user['user_name']);
    this.checkUpdateName = true;
  }

  updateName() {
    if (this.userNameUpdateForm.valid) {
      this.coolDialogs.confirm('ແກ້ໄຂຊື່ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Add'
      }).subscribe((res) => {
        if (res) {
          const data = {
            title: 'ແກ້ໄຂຮູບໂປຣຟາຍລ໌',
            _field: {
              name: this.userNameUpdateForm.value['fullname']
            }
          };
          this.userService.updateUser(data).subscribe((success) => {
            const user_on_storage = JSON.parse(localStorage.getItem('lt_token'));
            user_on_storage['data']['user_name'] = this.userNameUpdateForm.value['fullname'];
            localStorage.setItem('lt_token', JSON.stringify(user_on_storage));
            this.user['user_name'] = this.userNameUpdateForm.value['fullname'];
          }, (error) => {
            if (error.status === 405) {
              this.coolDialogs.alert(error.json()['message'], {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Warning'
              }).subscribe(() => {
                localStorage.clear();
                this.router.navigate(['/login']);
              });
            } else if (error.status <= 423 && error.status >= 400) {
              this.coolDialogs.alert(error.json()['message'], {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            } else {
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            }
          });
        }
      });
    }
  }

  viewUpdateProfile() {
    document.getElementById('id_choose_profile').click();
  }

}
