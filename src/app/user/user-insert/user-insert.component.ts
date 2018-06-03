import { UserService } from './../../services/user.service';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { StaticFunc } from './../../function-usages/static.func';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';

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
  private subscription: Subscription;

  // Form
  userForm: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage,
    private firebaseStorageRef: AngularFireStorage,
    private coolDialogs: NgxCoolDialogsService,
    private userService: UserService
  ) {
    // Create form
    this.userForm = formBuilder.group({
      user_name: [null, [Validators.required]],
      user_email: [null, [Validators.required]],
      user_pass: [null, [Validators.required]],
      user_confirm: [null, [Validators.required]],
      user_permission: ['us', [Validators.required]],
      user_profile: [null]
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
      const confirmSubscription: Subscription = this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນຜູ້ໃຊ້ນີ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Image'
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
            this.subscription = imageUploading.percentageChanges().subscribe((percent) => {
              this.uploadPercent = percent;
              if (percent === 100) {
                this.subscription.unsubscribe();
                setTimeout(() => {
                  this.savingChecked = true;
                  this.imageUploadMessage = 'ກຳລັງບັນທືກ...';
                  const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Users/' + imageName);
                  this.subscription = imageUrl.getDownloadURL().subscribe((url) => {
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
                      }, 4000);
                    }, (error) => {
                      try {
                        const message = error.json()['message'];
                        this.errorMessage = message;
                      } catch (err) {
                        this.errorMessage = 'ບໍ່ສາມາດສ້າງບັນຊີຜູ້ໃຊ້ໄດ້';
                      }
                    });
                  });
                }, 4000);
              }
            });
          } else {
            // save user data goes here
          }
        } else {
          // cancle logic goes here
        }
        confirmSubscription.unsubscribe();
      });
    } else {
      StaticFunc.triggerForm(this.userForm);
    }
    // const test = setInterval(() => {
    //   this.uploadPercent += 10;
    //   if (this.uploadPercent === 100) {
    //     this.savingChecked = true;
    //     this.imageUploadMessage = 'ກຳລັງບັນທືກ...';
    //     setTimeout(() => {
    //       this.savingChecked = false;
    //       this.savedChecked = true;
    //       setTimeout(() => {
    //         this.savedChecked = false;
    //         this.uploadImageChecked = false;
    //       }, 4000);
    //     }, 5000);
    //     clearInterval(test);
    //   }
    // }, 2000);
    // if (this.userForm.valid) {
    //   console.log(this.userForm.value);
    // }
  }
}
