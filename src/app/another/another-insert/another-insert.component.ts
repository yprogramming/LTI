import { AnotherService } from './../../services/another.service';
import { Router } from '@angular/router';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { NgProgress } from 'ngx-progressbar';
import { AddressService } from './../../services/address.service';
import { StaticFunc } from './../../function-usages/static.func';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-another-insert',
  templateUrl: './another-insert.component.html',
  styleUrls: ['./another-insert.component.css']
})
export class AnotherInsertComponent implements OnInit {

  // Image cropper
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  data: any;
  cropperSettings: CropperSettings;
  cropImageChecked: Boolean = false;
  uploadImageChecked: Boolean = false;
  savingChecked: Boolean = false;
  savedChecked: Boolean = false;
  checkImageAfterTrigerForm = false;

  // Upload
  uploadPercent: Array<any>;
  imageLengthUpload: number;
  imageIndexUpload: number;
  imageUploadMessage: string;

  // google maps zoom level
  zoom = 8;
  // initial center position for the map
  lat: number;
  lng: number;
  provinces: Array<Object> = [];
  districts: Array<Object> = [];
  villages: Array<string> = [];

  // Declare Form
  anotherForm: FormGroup;
  constructor(
    formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage,
    private firebaseStorageRef: AngularFireStorage,
    public progress: NgProgress,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router,
    private addressService: AddressService,
    private anotherService: AnotherService
  ) {
    this.progress.start();
    // Create Form
    this.anotherForm = formBuilder.group({
      ano_name: [null, [Validators.required]],
      ano_province: [null, [Validators.required]],
      ano_district: [null, [Validators.required]],
      ano_village: [null, [Validators.required]],
      ano_lat: [null, [Validators.required]],
      ano_long: [null, [Validators.required]],
      ano_detail: [null],
      ano_email: [null],
      ano_tel: [null],
      socials: formBuilder.array([this.initSocial()]),
      images: formBuilder.array([])
    });
    // Setting image cropper
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 1240;
    this.cropperSettings.height = 720;
    this.cropperSettings.croppedWidth = 1240;
    this.cropperSettings.croppedHeight = 720;
    this.cropperSettings.canvasWidth = 800;
    this.cropperSettings.canvasHeight = 500;
    this.data = {};

    this.uploadPercent = [];

    this.addressService.getProvinces().subscribe((provinces) => {
      this.provinces = provinces.json()['data'];
      this.districts = this.provinces[0]['districts'];
      const vils = this.districts[0]['villages'];
      for (let k = 0; k < vils.length; k++) {
        this.villages[k] = vils[k].village;
      }
      this.anotherForm.get('ano_province').setValue(this.provinces[0]['_id']);
      this.anotherForm.get('ano_district').setValue(this.districts[0]['_id']);
      this.progress.done();
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
      progress.done();
    });

   }

  initSocial() {
    return new FormGroup({
      name: new FormControl(null, [Validators.required]),
      url: new FormControl(null, [Validators.required, CustomValidators.url])
    });
  }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }

  initAddress() {
      this.districts = this.provinces[0]['districts'];
      const vils = this.districts[0]['villages'];
      for (let k = 0; k < vils.length; k++) {
        this.villages[k] = vils[k].village;
      }
      this.anotherForm.get('ano_province').setValue(this.provinces[0]['_id']);
      this.anotherForm.get('ano_district').setValue(this.districts[0]['_id']);
  }

  removeSocial(index) {
    (<FormArray>this.anotherForm.get('socials')).removeAt(index);
  }
  addNewSocial() {
    (<FormArray>this.anotherForm.get('socials')).push(this.initSocial());
  }
  socialLength() {
    return (<FormArray>this.anotherForm.get('socials')).length;
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
    this.anotherForm.value['images'].push(newImage);
    this.data = {};
    this.cropImageChecked = false;
  }

  changeDistrict() {
    const current_province_id = this.anotherForm.get('ano_province').value;
    for (let i = 0; i < this.provinces.length; i++) {
      if (this.provinces[i]['_id'] === current_province_id) {
        this.districts = this.provinces[i]['districts'];
        this.villages = [];
        const vils = this.districts[0]['villages'];
        for (let k = 0; k < vils.length; k++) {
          this.villages[k] = vils[k].village;
        }
        break;
      }
    }
  }

  changeVillage() {
    const current_district_id = this.anotherForm.get('ano_district').value;
    for (let i = 0; i < this.districts.length; i++) {
      if (this.districts[i]['_id'] === current_district_id) {
        this.villages = [];
        const vils = this.districts[i]['villages'];
        for (let k = 0; k < vils.length; k++) {
          this.villages[k] = vils[k].village;
        }
        break;
      }
    }
  }

  setCurrentLocationLatLong() {
    this.anotherForm.get('ano_lat').setValue(this.lat);
    this.anotherForm.get('ano_long').setValue(this.lng);
  }

  saveAnotherPlace() {

    // set some logic properties
    this.imageLengthUpload = this.anotherForm.value['images'].length;

    // if there are any files for upload
    if (this.anotherForm.valid && this.imageLengthUpload > 0) { // ຖ້າມີຮູບທີ່ຈະອັບໂຫຼດ

      this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນສະຖານທີ່ນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Insert'
      }).subscribe((res) => {
        if (res) {
          this.imageIndexUpload = 0;
          let checkFinished = 0;
          this.uploadPercent = [];
          this.imageUploadMessage = 'ກະລຸນາລໍຖ້າ...';
          this.uploadImageChecked = true;
          const anotherRef = this.firebaseStorage.ref('Anothers'); // ກຳນົດ Path ທີ່ຢູ່ຂອງຮູບໃນ Firebase Storage
          const uploadingImages = new Promise((resolve, reject) => { // ສ້າງໂພຼມິດທີ່ໃຊ້ກວດສອບວ່າອັບໂຫລດຮູບໝົດຫຼືຍັງ
            const imageUrls: Array<string> = [];
            for (let i = 0; i < this.imageLengthUpload; i++) {
              this.uploadPercent[i] = 0;
              /*const test = setInterval(() => {
                this.uploadPercent[i] += 10;
                if (this.uploadPercent[i] === 100) {
                  clearInterval(test);
                  resolve('OK all images are uploaded to storage');
                }
              }, 2000);*/
              const image = this.anotherForm.value['images'][i]; // ເອົາຮູບຈາກຟອມມາເກັບໄວ້
              const imageObject = image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
              const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
              const anotherUpload = anotherRef.child(imageName).putString(image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
              anotherUpload.percentageChanges().subscribe((percent) => {
                this.uploadPercent[i] = percent;                                                  // ເອົາເປີເຊັນການອັບໂຫຼດຂອງແຕ່ລະຮູບ

                if ( percent === 100) {                                                   // ເມື່ອໃດອັບໂຫລດສຳເລັດ ຮ້ອງຂໍ URL
                  this.imageIndexUpload += 1;
                  setTimeout(() => {
                    const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Anothers/' + imageName);  // ກຳໜົດ Reference
                    imageUrl.getDownloadURL().subscribe((url) => {
                      imageUrls[i] = url;                            // ເກັບ URL ຄືນໄວ້ໃນຟອມ
                      checkFinished += 1;
                      if (checkFinished === this.imageLengthUpload) {              // ອັບໂຫຼດໝົດເມື່ອໃດ ອອກຈາກໂພຼມິດສ໌ນີ້ທັງທີ່
                        resolve(imageUrls);
                      }
                    }, (err) => {
                      console.log(err);
                      reject('ດາວໂຫຼດ URL ຂອງຮູບທີ່ ' + i + ' ລົົ້ມເຫຼວ');
                    });
                  }, 3000);
                }
              }, (error) => {
                console.log(error);
                reject('ອັບໂຫຼດຮູບທີ່ ' + i + ' ລົົ້ມເຫຼວ');
              });
            }
          });
          uploadingImages.then((data: Array<string>) => {     // ເມື່ອຈົບການອັບໂຫຼດຮູບໃຫ້ບັນທຶກຂໍ້ມູນລົງໃນຖານຂໍ້ມູນ
            const imageUrls: Array<string> = data;
            this.imageUploadMessage = 'ກຳລັງບັນທຶກຂໍ້ມູນ...';
            this.savingChecked = true;
            this.anotherService.insertAnother(this.anotherForm.value, imageUrls).subscribe((success) => {
              this.savingChecked = false;
              this.savedChecked = true;
              setTimeout(() => {
                this.checkImageAfterTrigerForm = false;
                this.savedChecked = false;
                this.uploadImageChecked = false;
                if (success.json()['data']) {
                  const new_village = success.json()['data'];
                  const current_district_id = this.anotherForm.get('ano_district').value;
                  for (let j = 0; j < this.districts.length; j++) {
                    if (this.districts[j]['_id'] === current_district_id) {
                      this.districts[j]['villages'].push(new_village);
                    }
                  }
                }
                if (this.socialLength() > 0) {
                  for (let i = 1; i < this.socialLength(); i++) {
                    this.removeSocial(i);
                  }
                }
                this.anotherForm.reset();
                this.initAddress();
              }, 3000);
            }, (error) => {
              this.savedChecked = false;
              this.savingChecked = false;
              this.uploadImageChecked = false;
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
          }).catch((save_error) => {
            this.savedChecked = false;
            this.savingChecked = false;
            this.uploadImageChecked = false;
            this.coolDialogs.alert(save_error, {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Error'
            });
          });
        }
      });
    } else {
      this.checkImageAfterTrigerForm = true;
      StaticFunc.triggerForm(this.anotherForm);
    }
  }

}
