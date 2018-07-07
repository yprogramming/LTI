import { AttractionsService } from './../../services/attractions.service';
import { AddressService } from './../../services/address.service';
import { Router } from '@angular/router';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { NgProgress } from 'ngx-progressbar';
import { StaticFunc } from './../../function-usages/static.func';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailValidators } from 'ngx-validators';
import { CustomValidators } from 'ng2-validation';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-attraction-insert',
  templateUrl: './attraction-insert.component.html',
  styleUrls: ['./attraction-insert.component.css']
})
export class AttractionInsertComponent implements OnInit {
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

  attractionsForm: FormGroup;

  // google maps zoom level
  zoom = 8;
  // initial center position for the map
  lat: number;
  lng: number;
  label: string;
  provinces: Array<Object> = [];
  districts: Array<Object> = [];
  villages: Array<string> = [];
  attractions_types: Array<Object> = [];

  constructor(
    formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage,
    private firebaseStorageRef: AngularFireStorage,
    private safeSanitizer: DomSanitizer,
    public progress: NgProgress,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router,
    private addressService: AddressService,
    private attractionsService: AttractionsService
  ) {
    this.progress.start();
    // Create attractions form
    this.attractionsForm = formBuilder.group({
      att_name: [null, [Validators.required]],
      att_type: [null, [Validators.required]],
      att_province: [null, [Validators.required]],
      att_district: [null, [Validators.required]],
      att_village: [null, [Validators.required]],
      att_price: formBuilder.group({
        adult: new FormControl(null, [Validators.min(0)]),
        foreign: new FormControl(null, [Validators.min(0)]),
        children: new FormControl(null, [Validators.min(0)])
      }),
      att_lat: [null, [Validators.required]],
      att_long: [null, [Validators.required]],
      att_detail: [null, [Validators.required]],
      att_top: ['false', [Validators.required]],
      att_rules: [null],
      att_activity: [null],
      att_email: [null, [EmailValidators.simple]],
      att_tel: [null, [Validators.required]],
      socials: formBuilder.array([this.initSocial()]),
      images: formBuilder.array([]),
      att_video: [null, [CustomValidators.url]]
    });

    // Setting image cropper
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 1024;
    this.cropperSettings.height = this.cropperSettings.width / 1.5;
    this.cropperSettings.croppedWidth = 1024;
    this.cropperSettings.croppedHeight = this.cropperSettings.width / 1.5;
    this.cropperSettings.canvasWidth = 800;
    this.cropperSettings.canvasHeight = 500;
    this.data = {};

    this.uploadPercent = [];

    this.attractionsService.getAttractionsTypes().subscribe((types) => {
      this.attractions_types = types.json()['data'];
      this.attractionsForm.get('att_type').setValue(this.attractions_types[0]['_id']);
    }, (error) => {
      if (error.status <= 423 && error.status >= 400) {
        this.coolDialogs.alert(error.json()['message'], {
          theme: 'material', // available themes: 'default' | 'material' | 'dark'
          okButtonText: 'OK',
          color: 'black',
          title: 'Error'
        });
      }
    });

    this.addressService.getProvinces().subscribe((provinces) => {
      this.provinces = provinces.json()['data'];
      this.districts = this.provinces[0]['districts'];
      const vils = this.districts[0]['villages'];
      for (let k = 0; k < vils.length; k++) {
        this.villages[k] = vils[k].village;
      }
      this.attractionsForm.get('att_province').setValue(this.provinces[0]['_id']);
      this.attractionsForm.get('att_district').setValue(this.districts[0]['_id']);
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

  ngOnInit() {
    this.getCurrentLocationLatLong();
  }

  attSubForm(formGroup) {
    return <FormGroup> formGroup;
  }

  getCurrentLocationLatLong() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.label = 'ຈຸດທີ່ຕັ້ງປະຈຸບັນ';
      });
    }
  }

  changeLocation($event) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.label = 'ຈຸດທີ່ຖືກເລືອກ';
    this.setFormLocationLatLong();
  }

  setFormLocationLatLong() {
    this.attractionsForm.get('att_lat').setValue(this.lat);
    this.attractionsForm.get('att_long').setValue(this.lng);
  }

  setCurrentLocationLatLong() {
    this.getCurrentLocationLatLong();
    this.setFormLocationLatLong();
  }

  safeVideoUrl(url: string): SafeResourceUrl {
    const new_url = url.split('&')[0];
    const urlArray = new_url.split('=');
    if (urlArray[0] === 'https://www.youtube.com/watch?v') {
      const youtube_id = urlArray[1];
      const youtube_domain = urlArray[0].split('watch')[0];
      const youtube_embed_url = youtube_domain + 'embed/' + youtube_id;
      return this.safeSanitizer.bypassSecurityTrustResourceUrl(youtube_embed_url);
    }
    return this.safeSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  initAddress() {
    this.districts = this.provinces[0]['districts'];
    const vils = this.districts[0]['villages'];
    for (let k = 0; k < vils.length; k++) {
      this.villages[k] = vils[k].village;
    }
    this.attractionsForm.get('att_province').setValue(this.provinces[0]['_id']);
    this.attractionsForm.get('att_district').setValue(this.districts[0]['_id']);
  }

  initSocial() {
    return new FormGroup({
      name: new FormControl(null, [Validators.required]),
      url: new FormControl(null, [Validators.required, CustomValidators.url])
    });
  }

  removeSocial(index) {
    (<FormArray>this.attractionsForm.get('socials')).removeAt(index);
  }
  addNewSocial() {
    (<FormArray>this.attractionsForm.get('socials')).push(this.initSocial());
  }
  socialLength() {
    return (<FormArray>this.attractionsForm.get('socials')).length;
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
    this.attractionsForm.value['images'].push(newImage);
    this.data = {};
    this.cropImageChecked = false;
  }

  changeDistrict() {
    const current_province_id = this.attractionsForm.get('att_province').value;
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
    const current_district_id = this.attractionsForm.get('att_district').value;
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

  saveAttractions() {
    this.imageLengthUpload = this.attractionsForm.value['images'].length;
    if (this.attractionsForm.valid && this.imageLengthUpload > 0) {
      this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນສະຖານທີ່ທ່ອງທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
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
          const attractionsRef = this.firebaseStorage.ref('Attractions'); // ກຳນົດ Path ທີ່ຢູ່ຂອງຮູບໃນ Firebase Storage
          const uploadingImages = new Promise((resolve, reject) => { // ສ້າງໂພຼມິດທີ່ໃຊ້ກວດສອບວ່າອັບໂຫລດຮູບໝົດຫຼືຍັງ
            const imageUrls: Array<string> = [];
            for (let i = 0; i < this.imageLengthUpload; i++) {
              this.uploadPercent[i] = 0;
              const image = this.attractionsForm.value['images'][i]; // ເອົາຮູບຈາກຟອມມາເກັບໄວ້
              const imageObject = image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
              const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
              const attractionsUpload = attractionsRef.child(imageName).putString(image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
              attractionsUpload.percentageChanges().subscribe((percent) => {
                this.uploadPercent[i] = percent;                                                  // ເອົາເປີເຊັນການອັບໂຫຼດຂອງແຕ່ລະຮູບ
                if ( percent === 100) {
                  this.imageIndexUpload += 1;                                                 // ເມື່ອໃດອັບໂຫລດສຳເລັດ ຮ້ອງຂໍ URL
                  setTimeout(() => {
                    const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Attractions/' + imageName);
                    imageUrl.getDownloadURL().subscribe((url) => {
                      imageUrls[i] = url;                            // ເກັບ URL ຄືນໄວ້ໃນຟອມ
                      checkFinished += 1;
                      if (checkFinished === this.imageLengthUpload) {              // ອັບໂຫຼດໝົດເມື່ອໃດ ອອກຈາກໂພຼມິດສ໌ນີ້ທັນທີ່
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
            this.attractionsService.insertAttractions(this.attractionsForm.value, imageUrls).subscribe((success) => {
              this.savingChecked = false;
              this.savedChecked = true;
              setTimeout(() => {
                this.checkImageAfterTrigerForm = false;
                this.savedChecked = false;
                this.uploadImageChecked = false;
                if (success.json()['data']) {
                  const new_village = success.json()['data'];
                  const current_district_id = this.attractionsForm.get('att_district').value;
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
                this.attractionsForm.reset();
                this.attractionsForm.get('att_top').setValue('false');
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
                this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດໃນຂະນະສົ່ງຂໍຂໍ້ມູນ', {
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
      StaticFunc.triggerForm(this.attractionsForm);
    }
  }
}
