import { RestaurantService } from './../../services/restaurant.service';
import { AddressService } from './../../services/address.service';
import { Router } from '@angular/router';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { NgProgress } from 'ngx-progressbar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StaticFunc } from './../../function-usages/static.func';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { EmailValidators } from 'ngx-validators';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-restaurant-insert',
  templateUrl: './restaurant-insert.component.html',
  styleUrls: ['./restaurant-insert.component.css']
})
export class RestaurantInsertComponent implements OnInit {
  // Image cropper
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  data: any;
  cropperSettings: CropperSettings;
  cropImageChecked = false;
  uploadImageChecked: Boolean = false;
  savingChecked: Boolean = false;
  savedChecked: Boolean = false;
  checkImageAfterTrigerForm = false;

  // Upload
  uploadPercentRestaurant: Array<any>;
  uploadPercentFood: Array<any>;
  imageLengthUpload: number;
  imageIndexUpload: number;
  imageUploadMessage: string;

  // google maps zoom level
  zoom = 8;
  // initial center position for the map
  lat: number;
  lng: number;
  label: string;
  provinces: Array<Object> = [];
  districts: Array<Object> = [];
  villages: Array<string> = [];
  restaurant_types: Array<Object> = [];
  food_types: Array<Object> = [];

  // create restaurant form
  restaurantForm: FormGroup;
  foodIndex: any;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage,
    private firebaseStorageRestaurant: AngularFireStorage,
    private firebaseStorageFood: AngularFireStorage,
    private safeSanitizer: DomSanitizer,
    public progress: NgProgress,
    private coolDialogs: NgxCoolDialogsService,
    private router: Router,
    private addressService: AddressService,
    private restaurantService: RestaurantService
  ) {
    // Create restaurant Reactive form
    this.restaurantForm = formBuilder.group({
      res_name: [null, [Validators.required]],
      res_type: [null, [Validators.required]],
      res_province: [null, [Validators.required]],
      res_district: [null, [Validators.required]],
      res_village: [null, [Validators.required]],
      res_lat: [null, [Validators.required]],
      res_long: [null, [Validators.required]],
      res_detail: [null],
      res_email: [null, [Validators.required, EmailValidators.simple]],
      res_tel: [null, [Validators.required]],
      res_video: [null, [CustomValidators.url]],
      socials: formBuilder.array([this.initSocial()]),
      foods: formBuilder.array([this.initFood(null)]),
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

    this.uploadPercentRestaurant = [];
    this.uploadPercentFood = [];

    this.restaurantService.getRestaurantTypes().subscribe((types) => {
      this.restaurant_types = types.json()['data'];
      if (this.restaurant_types.length  > 0) {
        this.restaurantForm.get('res_type').setValue(this.restaurant_types[0]['_id']);
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

    this.restaurantService.getFoodTypes().subscribe((types) => {
      this.food_types = types.json()['data'];
      if (this.food_types.length  > 0) {
        (<FormArray>this.restaurantForm.get('foods')).controls[0].get('food_type').setValue(this.food_types[0]['_id']);
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
        this.restaurantForm.get('res_province').setValue(this.provinces[0]['_id']);
        this.restaurantForm.get('res_district').setValue(this.districts[0]['_id']);
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
    this.restaurantForm.get('res_lat').setValue(this.lat);
    this.restaurantForm.get('res_long').setValue(this.lng);
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
    this.restaurantForm.get('res_province').setValue(this.provinces[0]['_id']);
    this.restaurantForm.get('res_district').setValue(this.districts[0]['_id']);
  }

  initSocial() {
    return new FormGroup({
      name: new FormControl(null, [Validators.required]),
      url: new FormControl(null, [Validators.required, CustomValidators.url])
    });
  }

  initFood(type_id) {
    return new FormGroup({
      food_name: new FormControl(null, [Validators.required]),
      food_type: new FormControl(type_id, [Validators.required]),
      food_price: new FormControl(null, [Validators.required, Validators.min(0)]),
      image: new FormControl(null, [Validators.required])
    });
  }

  removeSocial(index) {
    (<FormArray>this.restaurantForm.get('socials')).removeAt(index);
  }
  addNewSocial() {
    (<FormArray>this.restaurantForm.get('socials')).push(this.initSocial());
  }
  socialLength() {
    return (<FormArray>this.restaurantForm.get('socials')).length;
  }

  removeFoodMenu(index) {
    (<FormArray>this.restaurantForm.get('foods')).removeAt(index);
  }
  addNewFoodMenu() {
    (<FormArray>this.restaurantForm.get('foods')).push(this.initFood(this.food_types[0]['_id']));
  }
  getFoodControls() {
    return (<FormArray>this.restaurantForm.get('foods')).controls;
  }
  foodLength() {
    return (<FormArray>this.restaurantForm.get('foods')).length;
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
    this.foodIndex = index;
  }

  cancelCrop() {
    this.data = {};
    this.cropImageChecked = false;
  }

  croppedImage() {
    const newImage = this.data.image;
    if ( this.foodIndex === null) {
      this.restaurantForm.value['images'].push(newImage);
    } else if ( this.foodIndex >= 0 ) {
      (<FormGroup>(<FormArray> this.restaurantForm.get('foods')).controls[this.foodIndex]).get('image').setValue(newImage);
    }
    this.foodIndex = null;
    this.data = {};
    this.cropImageChecked = false;
  }

  changeDistrict() {
    const current_province_id = this.restaurantForm.get('res_province').value;
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
    const current_district_id = this.restaurantForm.get('res_district').value;
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

  saveRestaurant() {
    this.imageLengthUpload = this.restaurantForm.value['images'].length;
    if (this.restaurantForm.valid && this.imageLengthUpload > 0) { // ຖ້າມີຮູບທີ່ຈະອັບໂຫຼດ

      this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນຮ້ານອາຫານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Insert'
      }).subscribe((res) => {
        if (res) {
          this.imageIndexUpload = 0;
          let checkFinish = 0;
          this.uploadPercentRestaurant = [];
          this.uploadPercentFood = [];
          this.imageUploadMessage = 'ກະລຸນາລໍຖ້າ...';
          this.uploadImageChecked = true;

          const foods = this.restaurantForm.value['foods'].slice(0, this.restaurantForm.value['foods'].length);
          for (let i = 0; i < foods.length; i++) {
            if (foods[i].image !== null) {
              this.imageLengthUpload += 1;
            }
          }

          const restaurantRef = this.firebaseStorage.ref('Restaurants'); // ກຳນົດ Path ທີ່ຢູ່ຂອງຮູບໃນ Firebase Storage
          const uploadingImages = new Promise((resolve, reject) => { // ສ້າງໂພຼມິດທີ່ໃຊ້ກວດສອບວ່າອັບໂຫລດຮູບໝົດຫຼືຍັງ
            const imageUrls: Array<string> = [];

            for (let i = 0; i < this.restaurantForm.value['images'].length; i++) {
              this.uploadPercentRestaurant[i] = 0;
              const image = this.restaurantForm.value['images'][i]; // ເອົາຮູບຈາກຟອມມາເກັບໄວ້
              const imageObject = image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
              const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
              const restaurantUpload = restaurantRef.child(imageName).putString(image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
              restaurantUpload.percentageChanges().subscribe((percent) => {
                this.uploadPercentRestaurant[i] = percent;                                           // ເອົາເປີເຊັນການອັບໂຫຼດຂອງແຕ່ລະຮູບ
                console.log(percent);
                if ( percent === 100) {                                                   // ເມື່ອໃດອັບໂຫລດສຳເລັດ ຮ້ອງຂໍ URL
                  this.imageIndexUpload += 1;
                  setTimeout(() => {
                    const imageUrl: AngularFireStorageReference = this.firebaseStorageRestaurant.ref('Restaurants/' + imageName);
                    imageUrl.getDownloadURL().subscribe((url) => {
                      imageUrls[i] = url;                            // ເກັບ URL ຄືນໄວ້ໃນຟອມ
                      checkFinish += 1;
                      if (this.imageIndexUpload === this.imageLengthUpload) {              // ອັບໂຫຼດໝົດເມື່ອໃດ ອອກຈາກໂພຼມິດສ໌ນີ້ທັງທີ່
                        resolve({restaurantImages: imageUrls, newFoods: foods});
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

            for (let i = 0; i < foods.length; i++) {
              this.uploadPercentFood[i] = 0;
              if (foods[i].image !== null) {
                const image = foods[i].image; // ເອົາຮູບຈາກຟອມມາເກັບໄວ້
                const imageObject = image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
                const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
                const foodUpload = restaurantRef.child('Foods').child(imageName).putString(image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Storage
                foodUpload.percentageChanges().subscribe((percent) => {
                  this.uploadPercentFood[i] = percent;
                  if ( percent === 100) {                                                   // ເມື່ອໃດອັບໂຫລດສຳເລັດ ຮ້ອງຂໍ URL
                    this.imageIndexUpload += 1;
                    setTimeout(() => {
                      const imageUrl: AngularFireStorageReference = this.firebaseStorageFood.ref('Restaurants/Foods/' + imageName);
                      imageUrl.getDownloadURL().subscribe((url) => {
                        foods[i].image = url;                            // ເກັບ URL ຄືນໄວ້ໃນຟອມ
                        checkFinish += 1;
                        if (checkFinish === this.imageLengthUpload) {              // ອັບໂຫຼດໝົດເມື່ອໃດ ອອກຈາກໂພຼມິດສ໌ນີ້ທັງທີ່
                          resolve({restaurantImages: imageUrls, newFoods: foods});
                        }
                      }, (err) => {
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
            const restaurantImageUrls: Array<string> = data['restaurantImages'];
            const newFoods: Array<Object>  = data['newFoods'];
            this.imageUploadMessage = 'ກຳລັງບັນທຶກຂໍ້ມູນ...';
            this.savingChecked = true;
            this.restaurantService.insertRestaurant(this.restaurantForm.value, restaurantImageUrls, newFoods).subscribe((success) => {
              this.savingChecked = false;
              this.savedChecked = true;
              setTimeout(() => {
                this.checkImageAfterTrigerForm = false;
                this.savedChecked = false;
                this.uploadImageChecked = false;
                if (success.json()['data']) {
                  const new_village = success.json()['data'];
                  const current_district_id = this.restaurantForm.get('res_district').value;
                  for (let j = 0; j < this.districts.length; j++) {
                    if (this.districts[j]['_id'] === current_district_id) {
                      this.districts[j]['villages'].push(new_village);
                    }
                  }
                }
                for (let i = 1; i < this.socialLength(); i++) {
                  this.removeSocial(i);
                }
                for (let i = 1; i < this.foodLength(); i++) {
                  this.removeFoodMenu(i);
                }
                this.restaurantForm.reset();
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
      StaticFunc.triggerForm(this.restaurantForm);
    }
  }
}
