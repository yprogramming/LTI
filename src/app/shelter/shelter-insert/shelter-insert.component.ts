import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ShelterService } from './../../services/shelter.service';
import { AddressService } from './../../services/address.service';
import { Router } from '@angular/router';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { NgProgress } from 'ngx-progressbar';
import { StaticFunc } from './../../function-usages/static.func';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { EmailValidators } from 'ngx-validators';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-shelter-insert',
  templateUrl: './shelter-insert.component.html',
  styleUrls: ['./shelter-insert.component.css']
})
export class ShelterInsertComponent implements OnInit {
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
  uploadPercentShelter: Array<any>;
  uploadPercentRoom: Array<any>;
  imageLengthUpload: number;
  imageIndexUpload: number;
  imageUploadMessage: string;

  // Form
  shelterForm: FormGroup;
  roomIndex: any;

  // google maps zoom level
  zoom = 8;
  // initial center position for the map
  lat: number;
  lng: number;
  label: string;
  provinces: Array<Object> = [];
  districts: Array<Object> = [];
  villages: Array<string> = [];
  shelter_types: Array<Object> = [];

  constructor(
    formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage,
    private firebaseStorageShelter: AngularFireStorage,
    private firebaseStorageRoom: AngularFireStorage,
    private safeSanitizer: DomSanitizer,
    public progress: NgProgress,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router,
    private addressService: AddressService,
    private shelterService: ShelterService
  ) {

    this.progress.start();
    // Create shelter form
    this.shelterForm = formBuilder.group({
      shelt_name: [null, [Validators.required]],
      shelt_type: [null, [Validators.required]],
      shelt_province: [null, [Validators.required]],
      shelt_district: [null, [Validators.required]],
      shelt_village: [null, [Validators.required]],
      shelt_lat: [null, [Validators.required]],
      shelt_long: [null, [Validators.required]],
      shelt_detail: [null],
      shelt_email: [null, [Validators.required, EmailValidators.simple]],
      shelt_tel: [null, [Validators.required]],
      socials: formBuilder.array([this.initSocial()]),
      images: formBuilder.array([]),
      shelt_video: [null, [CustomValidators.url]],
      rooms: formBuilder.array([this.initRoom()])
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

    this.uploadPercentShelter = [];
    this.uploadPercentRoom = [];

    this.shelterService.getShelterTypes().subscribe((types) => {
      this.shelter_types = types.json()['data'];
      if (this.shelter_types.length  > 0) {
        this.shelterForm.get('shelt_type').setValue(this.shelter_types[0]['_id']);
      }
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
      if (this.provinces.length  > 0) {
        this.shelterForm.get('shelt_province').setValue(this.provinces[0]['_id']);
        this.shelterForm.get('shelt_district').setValue(this.districts[0]['_id']);
      }
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
    this.shelterForm.get('shelt_lat').setValue(this.lat);
    this.shelterForm.get('shelt_long').setValue(this.lng);
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
    this.shelterForm.get('shelt_province').setValue(this.provinces[0]['_id']);
    this.shelterForm.get('shelt_district').setValue(this.districts[0]['_id']);
  }

  initSocial() {
    return new FormGroup({
      name: new FormControl(null, [Validators.required]),
      url: new FormControl(null, [Validators.required, CustomValidators.url])
    });
  }

  initRoom() {
    return new FormGroup({
      style: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
      room_image: new FormControl(null, [Validators.required])
    });
  }

  removeSocial(index) {
    (<FormArray>this.shelterForm.get('socials')).removeAt(index);
  }
  addNewSocial() {
    (<FormArray>this.shelterForm.get('socials')).push(this.initSocial());
  }
  socialLength() {
    return (<FormArray>this.shelterForm.get('socials')).length;
  }

  removeRoomStyle(index) {
    (<FormArray>this.shelterForm.get('rooms')).removeAt(index);
  }
  addNewRoomStyle() {
    (<FormArray>this.shelterForm.get('rooms')).push(this.initRoom());
  }
  getRoomControls() {
    return (<FormArray> this.shelterForm.get('rooms')).controls;
  }
  roomsLength() {
    return (<FormArray>this.shelterForm.get('rooms')).length;
  }

  fileChangeListener($event, index) {
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
    this.roomIndex = index;
  }

  cancelCrop() {
    this.data = {};
    this.cropImageChecked = false;
  }

  croppedImage() {
    const newImage = this.data.image;
    if ( this.roomIndex === null) {
      this.shelterForm.value['images'].push(newImage);
    } else if ( this.roomIndex >= 0 ) {
      (<FormGroup>(<FormArray> this.shelterForm.get('rooms')).controls[this.roomIndex]).get('room_image').setValue(newImage);
    }
    this.data = {};
    this.cropImageChecked = false;
    this.roomIndex = null;
  }

  changeDistrict() {
    const current_province_id = this.shelterForm.get('shelt_province').value;
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
    const current_district_id = this.shelterForm.get('shelt_district').value;
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

  saveShelter() {
    this.imageLengthUpload = this.shelterForm.value['images'].length;
    if (this.shelterForm.valid && this.imageLengthUpload > 0) { // ຖ້າມີຮູບທີ່ຈະອັບໂຫຼດ
      this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນສະຖານທີ່ພັກອາໄສນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Insert'
      }).subscribe((res) => {
        if (res) {
          this.imageIndexUpload = 0;
          let imageUploadedCheck = 0;
          this.uploadPercentShelter = [];
          this.uploadPercentRoom = [];
          this.imageUploadMessage = 'ກະລຸນາລໍຖ້າ...';
          this.uploadImageChecked = true;
          const rooms = this.shelterForm.value['rooms'].slice(0, this.shelterForm.value['rooms'].length);
          for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].room_image !== null) {
              this.imageLengthUpload += 1;
            }
          }

          const shelterRef = this.firebaseStorage.ref('Shelters'); // ກຳນົດ Path ທີ່ຢູ່ຂອງຮູບໃນ Firebase Storage
          const uploadingImages = new Promise((resolve, reject) => { // ສ້າງໂພຼມິດທີ່ໃຊ້ກວດສອບວ່າອັບໂຫລດຮູບໝົດຫຼືຍັງ
            const imageUrls: Array<string> = [];

            for (let i = 0; i < this.shelterForm.value['images'].length; i++) {
              this.uploadPercentShelter[i] = 0;
              const image = this.shelterForm.value['images'][i]; // ເອົາຮູບຈາກຟອມມາເກັບໄວ້
              const imageObject = image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
              const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
              const shelterUpload = shelterRef.child(imageName).putString(image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
              shelterUpload.percentageChanges().subscribe((percent) => {
                this.uploadPercentShelter[i] = percent;                                           // ເອົາເປີເຊັນການອັບໂຫຼດຂອງແຕ່ລະຮູບ
                if ( percent === 100) {                                                   // ເມື່ອໃດອັບໂຫລດສຳເລັດ ຮ້ອງຂໍ URL
                  this.imageIndexUpload += 1;
                  setTimeout(() => {
                    const imageUrl: AngularFireStorageReference = this.firebaseStorageShelter.ref('Shelters/' + imageName);
                    imageUrl.getDownloadURL().subscribe((url) => {
                      imageUrls[i] = url;                            // ເກັບ URL ຄືນໄວ້ໃນຟອມ
                      imageUploadedCheck += 1;
                      if (imageUploadedCheck === this.imageLengthUpload) {              // ອັບໂຫຼດໝົດເມື່ອໃດ ອອກຈາກໂພຼມິດສ໌ນີ້ທັງທີ່
                        resolve({shelterImages: imageUrls, newRooms: rooms});
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

            for (let i = 0; i < rooms.length; i++) {
              this.uploadPercentRoom[i] = 0;
              if (rooms[i].room_image !== null) {
                const image = rooms[i].room_image; // ເອົາຮູບຈາກຟອມມາເກັບໄວ້
                const imageObject = image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
                const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
                const roomUpload = shelterRef.child('Rooms').child(imageName).putString(image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Storage
                roomUpload.percentageChanges().subscribe((percent) => {
                  this.uploadPercentRoom[i] = percent;
                  if ( percent === 100) {                                                   // ເມື່ອໃດອັບໂຫລດສຳເລັດ ຮ້ອງຂໍ URL
                    this.imageIndexUpload += 1;                                  // ຄືນການ subscribe
                    setTimeout(() => {
                      const imageUrl: AngularFireStorageReference = this.firebaseStorageRoom.ref('Shelters/Rooms/' + imageName);
                      imageUrl.getDownloadURL().subscribe((url) => {
                        rooms[i].room_image = url;                            // ເກັບ URL ຄືນໄວ້ໃນຟອມ
                        imageUploadedCheck += 1;
                        if (imageUploadedCheck === this.imageLengthUpload) {              // ອັບໂຫຼດໝົດເມື່ອໃດ ອອກຈາກໂພຼມິດສ໌ນີ້ທັງທີ່
                          resolve({shelterImages: imageUrls, newRooms: rooms});
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
            }
          });
          uploadingImages.then((data: Object) => {     // ເມື່ອຈົບການອັບໂຫຼດຮູບໃຫ້ບັນທຶກຂໍ້ມູນລົງໃນຖານຂໍ້ມູນ
            const shelterImageUrls: Array<string> = data['shelterImages'];
            const newRooms: Array<Object>  = data['newRooms'];
            this.imageUploadMessage = 'ກຳລັງບັນທຶກຂໍ້ມູນ...';
            this.savingChecked = true;
            this.shelterService.insertShelter(this.shelterForm.value, shelterImageUrls, newRooms).subscribe((success) => {
              this.savingChecked = false;
              this.savedChecked = true;
              setTimeout(() => {
                this.checkImageAfterTrigerForm = false;
                this.savedChecked = false;
                this.uploadImageChecked = false;
                if (success.json()['data']) {
                  const new_village = success.json()['data'];
                  const current_district_id = this.shelterForm.get('shelt_district').value;
                  for (let j = 0; j < this.districts.length; j++) {
                    if (this.districts[j]['_id'] === current_district_id) {
                      this.districts[j]['villages'].push(new_village);
                    }
                  }
                }
                for (let i = 1; i < this.socialLength(); i++) {
                  this.removeSocial(i);
                }
                for (let i = 1; i < this.roomsLength(); i++) {
                  this.removeRoomStyle(i);
                }
                this.shelterForm.reset();
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
      StaticFunc.triggerForm(this.shelterForm);
    }
  }

}
