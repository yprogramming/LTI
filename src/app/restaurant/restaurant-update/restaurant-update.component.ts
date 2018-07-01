import { NotificationService } from './../../services/notification.service';
import { StaticFunc } from './../../function-usages/static.func';
import { RestaurantService } from './../../services/restaurant.service';
import { AddressService } from './../../services/address.service';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { NgProgress } from 'ngx-progressbar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-restaurant-update',
  templateUrl: './restaurant-update.component.html',
  styleUrls: ['./restaurant-update.component.css']
})
export class RestaurantUpdateComponent implements OnInit {

  // Image cropper
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  data: any;
  cropperSettings: CropperSettings;
  cropImageChecked: Boolean = false;

  // Check properties
  checkEditProfile = false;
  checkEditName = false;
  checkEditAddress = false;
  checkEditLocation = false;
  checkEditDetail = false;
  checkEditContact = false;
  checkEditVideo = false;
  checkEditSocial = false;
  checkAddSocial = false;
  checkEditFood = false;
  checkAddFood = false;
  uploadImageChecked: Boolean = false;
  savingChecked: Boolean = false;
  savedChecked: Boolean = false;
  feedbackChecked: Boolean = false;

  // Forms
  updateTittleForm: FormGroup;
  updateAddressForm: FormGroup;
  updateDetailForm: FormGroup;
  updateContactForm: FormGroup;
  updateVideoForm: FormGroup;
  addNewSocialForm: FormGroup;
  updateSocailForm: FormGroup;
  updateFoodForm: FormGroup;
  addNewFoodForm: FormGroup;
  feedbackForm: FormGroup;

  // Address data
  provinces: Array<Object> = [];
  districts: Array<Object> = [];
  villages: Array<string> = [];
  uploadPercent: any;

  // main data
  restaurant: Object = {};
  restaurant_types: Array<Object> = [];
  food_types: Array<Object> = [];

  foodIndex: any;

  // google maps zoom level
  zoom = 8;
  // initial center position for the map
  lat: number;
  lng: number;
  label: string;

  constructor(
    private formBuilder: FormBuilder,
    private safeSanitizer: DomSanitizer,
    public progress: NgProgress,
    private firebaseStorage: AngularFireStorage,
    private firebaseStorageRef: AngularFireStorage,
    private router: Router,
    private query: ActivatedRoute,
    private coolDialogs: NgxCoolDialogsService,
    private addressService: AddressService,
    private restaurantService: RestaurantService,
    private notificationService: NotificationService
  ) {
    this.progress.start();
    // Create Forms
    this.updateTittleForm = formBuilder.group({
      res_name: [null, [Validators.required]],
      res_type: [null, [Validators.required]]
    });
    this.updateAddressForm = formBuilder.group({
      res_province: [null, [Validators.required]],
      res_district: [null, [Validators.required]],
      res_village: [null, [Validators.required]]
    });
    this.updateDetailForm = formBuilder.group({
      res_detail: [null, [Validators.required]]
    });
    this.updateContactForm = formBuilder.group({
      res_email: [null],
      res_tel: [null, [Validators.required]]
    });
    this.updateVideoForm = formBuilder.group({
      res_video: [null, [Validators.required, CustomValidators.url]]
    });
    this.addNewSocialForm = formBuilder.group({
      name: [null, [Validators.required]],
      url: [null, [Validators.required, CustomValidators.url]]
    });
    this.updateSocailForm = formBuilder.group({
      idx: [null, [Validators.required]],
      _id: [null, [Validators.required]],
      name: [null, [Validators.required]],
      url: [null, [Validators.required, CustomValidators.url]]
    });
    this.updateFoodForm = formBuilder.group({
      idx: [null, [Validators.required]],
      _id: [null, [Validators.required]],
      food_name: [null, [Validators.required]],
      food_type: [null, [Validators.required]],
      food_price: [null, [Validators.required]],
      image: [null, [Validators.required]]
    });
    this.addNewFoodForm = formBuilder.group({
      add_food_name: [null, [Validators.required]],
      add_food_type: [null, [Validators.required]],
      add_food_price: [null, [Validators.required]],
      add_image: [null, [Validators.required]]
    });

    this.feedbackForm = formBuilder.group({
      message: ['', [Validators.required]]
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

    this.restaurantService.getRestaurantTypes().subscribe((types) => {
      this.restaurant_types = types.json()['data'];
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

    query.params.subscribe((params) => {
      if (params.id) {
      const res_id = params.id;
      restaurantService.getRestaurant(res_id).subscribe((res) => {
         this.restaurant = res.json()['data'];
         this.lat = this.restaurant['location']['lat'];
         this.lng = this.restaurant['location']['long'];
         this.label = this.restaurant['name'];
       }, (error) => {
         if (error.status === 405) {
           this.coolDialogs.alert(error.json()['message'], {
             theme: 'material', // available themes: 'default' | 'material' | 'dark'
             okButtonText: 'OK',
             color: 'black',
             title: 'Warning'
           }).subscribe((ok) => {
             localStorage.clear();
             this.router.navigate(['/login']);
           });
         } else if (error.status <= 423 && error.status >= 400) {
           this.coolDialogs.alert(error.json()['message'], {
             theme: 'material', // available themes: 'default' | 'material' | 'dark'
             okButtonText: 'OK',
             color: 'black',
             title: 'Error'
           }).subscribe((ok) => {
             this.router.navigate(['/dashboard', 'restaurant']);
           });
         } else {
           this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
             theme: 'material', // available themes: 'default' | 'material' | 'dark'
             okButtonText: 'OK',
             color: 'black',
             title: 'Error'
           }).subscribe((ok) => {
            this.router.navigate(['/dashboard', 'shelter']);
          });
         }
       });
      }
     });

   }

  ngOnInit() {

    this.addressService.getProvinces().subscribe((provinces) => {
      this.provinces = provinces.json()['data'];
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
      this.progress.done();
    });

  }

  cancelVideo() {
    this.updateVideoForm.reset();
    this.checkEditVideo = false;
  }
  safeVideoUrl(): SafeResourceUrl {
    let url = '';
    if (this.updateVideoForm.value['res_video'] && this.updateVideoForm.valid) {
      url = this.updateVideoForm.value['res_video'];
    } else if (this.restaurant['video_url']) {
      url = this.restaurant['video_url'];
    }
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
      this.coolDialogs.confirm('ອັບໂຫຼດ ແລະ ບັນທືກຮູບນີ້ແທ້ບໍ?', {
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
          const restaurantRef = this.firebaseStorage.ref('Restaurant');
          const imageObject = new_image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
          const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
          const restaurantUpload = restaurantRef.child(imageName).putString(new_image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
          restaurantUpload.percentageChanges().subscribe((percent) => {
            this.uploadPercent = percent;
            if (percent === 100) {
              setTimeout(() => {
                const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Restaurant/' + imageName);  // ກຳໜົດ Reference
                imageUrl.getDownloadURL().subscribe((url) => {
                  const image_url = url;
                  this.uploadImageChecked = false;
                  this.savingChecked = true;
                  const data = {
                    res_id: this.restaurant['_id'],
                    img_url: image_url
                  };

                  this.restaurantService.insertImage(data).subscribe((success) => {
                    this.savingChecked = false;
                    this.savedChecked = true;
                    setTimeout(() => {
                      this.savedChecked = false;
                      this.cropImageChecked = false;
                      this.restaurant['images'].push(image_url);
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
    } else if ( this.foodIndex >= 0 ) {
      this.updateFoodForm.get('image').setValue(newImage);
      this.cropImageChecked = false;
    } else if ( this.foodIndex === 'add') {
      this.addNewFoodForm.get('add_image').setValue(newImage);
      this.cropImageChecked = false;
    }
    this.foodIndex = null;
    this.data = {};
  }

  checkPublished() {
    return StaticFunc.published(this.restaurant['published']);
  }

  setCurrentLocationLatLong() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.label = 'ຈຸດທີ່ຕັ້ງປະຈຸບັນ';
      });
    }
  }

  changeLocation($event) {
    if (this.checkEditLocation) {
      this.lat = $event.coords.lat;
      this.lng = $event.coords.lng;
      this.label = 'ຈຸດທີ່ຖືກເລືອກ';
    }
  }

  cancelLocation() {
    this.lat = this.restaurant['location']['lat'];
    this.lng = this.restaurant['location']['long'];
    this.label = this.restaurant['name'];
    this.checkEditLocation = false;
  }

  changeDistrict() {
    const current_province_id = this.updateAddressForm.get('res_province').value;
    for (let i = 0; i < this.provinces.length; i++) {
      if (this.provinces[i]['_id'] === current_province_id) {
        this.districts = this.provinces[i]['districts'];
        this.updateAddressForm.get('res_district').setValue(this.districts[0]['_id']);
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
    const current_district_id = this.updateAddressForm.get('res_district').value;
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

  getImage(imageUrl) {
    if (navigator.onLine) {
      return imageUrl;
    }
    return 'assets/img/ic_image.png';
  }

  viewEditName() {
    this.updateTittleForm.get('res_name').setValue(this.restaurant['name']);
    this.updateTittleForm.get('res_type').setValue(this.restaurant['restaurant_type']['_id']);
    this.checkEditName = true;
  }

  viewEditAddress() {
    const res_province_id = this.restaurant['address']['district']['province']['_id'];
    for (let i = 0; i < this.provinces.length; i++) {
      if (this.provinces[i]['_id'] === res_province_id) {
        this.districts = this.provinces[i]['districts'];
        this.villages = [];
        const vils = this.districts[0]['villages'];
        for (let k = 0; k < vils.length; k++) {
          this.villages[k] = vils[k].village;
        }
        break;
      }
    }
    this.updateAddressForm.get('res_province').setValue(this.restaurant['address']['district']['province']['_id']);
    this.updateAddressForm.get('res_district').setValue(this.restaurant['address']['district']['_id']);
    this.updateAddressForm.get('res_village').setValue(this.restaurant['address']['village']);
    this.checkEditAddress = true;
  }

  viewEditDetail() {
    this.updateDetailForm.get('res_detail').setValue(this.restaurant['detail']);
    this.checkEditDetail = true;
  }

  viewEditContact() {
    this.updateContactForm.get('res_tel').setValue(this.restaurant['tel']);
    this.updateContactForm.get('res_email').setValue(this.restaurant['email']);
    this.checkEditContact = true;
  }

  viewEditVideo() {
    this.updateVideoForm.get('res_video').setValue(this.restaurant['video_url']);
    this.checkEditVideo = true;
  }

  viewEditSocial(i, social) {
    this.updateSocailForm.get('idx').setValue(i);
    this.updateSocailForm.get('_id').setValue(social['_id']);
    this.updateSocailForm.get('name').setValue(social['name']);
    this.updateSocailForm.get('url').setValue(social['url']);
    this.checkEditSocial = true;
  }

  viewEditFood(i, food) {
    this.updateFoodForm.get('idx').setValue(i);
    this.updateFoodForm.get('_id').setValue(food['_id']);
    this.updateFoodForm.get('food_name').setValue(food['name']);
    this.updateFoodForm.get('food_type').setValue(food['food_type']['_id']);
    this.updateFoodForm.get('food_price').setValue(food['price']);
    this.updateFoodForm.get('image').setValue(food['image']);
    this.checkEditFood = true;
  }

  // Update methods
  updateTitle() {
    if (this.updateTittleForm.valid) {
      const data = {
        res_id: this.restaurant['_id'],
        title: 'ປ່ຽນຊື່ຈາກ ' + this.restaurant['name'] + ' ເປັນ ' + this.updateTittleForm.value['res_name'],
        _field: {
          name: this.updateTittleForm.value['res_name'],
          restaurant_type: this.updateTittleForm.value['res_type']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຊື່ຮ້ານອາຫານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.restaurantService.updateRestaurant(data).subscribe((success) => {
            this.restaurant['name'] = this.updateTittleForm.value['res_name'];
            for (let i = 0; i < this.restaurant_types.length; i++) {
              if (this.restaurant_types[i]['_id'] === this.updateTittleForm.value['res_type']) {
                this.restaurant['restaurant_type']['_id'] = this.updateTittleForm.value['res_type'];
                this.restaurant['restaurant_type']['name'] = this.restaurant_types[i]['name'];
              }
            }
            this.checkEditName = false;
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງແກ້ໄຂຂໍ້ມູນ', {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            }
          });
        }
      });
    } else {
      StaticFunc.triggerForm(this.updateTittleForm);
    }
  }
  updateAddress() {
    if (this.updateAddressForm.valid) {
      const data = {
        res_id: this.restaurant['_id'],
        res_name: this.restaurant['name'],
        address: this.updateAddressForm.value
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນທີ່ຢູ່ຂອງຮ້ານອາຫານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.restaurantService.updateAddress(data).subscribe((success) => {

            const new_data = success.json()['data'];
            this.restaurant['address']['village'] = new_data['village'];
            this.restaurant['address']['_id'] = new_data['_id'];

            const current_province_id = this.updateAddressForm.get('res_province').value;
            for (let i = 0; i < this.provinces.length; i++) {
              if (this.provinces[i]['_id'] === current_province_id) {
                this.restaurant
                      ['address']
                      ['district']
                      ['province']
                      ['_id'] = this.provinces[i]['_id'];
                this.restaurant
                      ['address']
                      ['district']
                      ['province']
                      ['province'] = this.provinces[i]['province'];
                this.districts = this.provinces[i]['districts'];
                break;
              }
            }

            const current_district_id = new_data['district'];
            for (let i = 0; i < this.districts.length; i++) {
              if (this.districts[i]['_id'] === current_district_id) {
                this.restaurant
                      ['address']
                      ['district']
                      ['_id'] = this.districts[i]['_id'];
                this.restaurant
                      ['address']
                      ['district']
                      ['district'] = this.districts[i]['district'];
                const exist_village = this.districts[i]['villages'].filter((vil) => {
                  return vil['_id'] === new_data['_id'];
                });
                if (exist_village.length <= 0) {
                  this.districts[i]['villages'].push(new_data);
                }
                this.villages = [];
                const vils = this.districts[i]['villages'];
                for (let k = 0; k < vils.length; k++) {
                  this.villages[k] = vils[k].village;
                }
                break;
              }
            }

            this.checkEditAddress = false;

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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງແກ້ໄຂຂໍ້ມູນ', {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            }
          });
        }
      });

    } else {
      StaticFunc.triggerForm(this.updateAddressForm);
    }
  }
  updateLocation() {
    if ((this.lat !== this.restaurant['location']['lat'])) {
      const data = {
        res_id: this.restaurant['_id'],
        title: 'ປ່ຽນຈຸດທີ່ຕັ້ງຂອງ \'' + this.restaurant['name'] + '\'',
        _field: {
          location: {
            lat: this.lat,
            long: this.lng
          }
        }
      };

      this.coolDialogs.confirm('ປ່ຽນແປງຈຸດທີ່ຕັ້ງຂອງຮ້ານອາຫານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.restaurantService.updateRestaurant(data).subscribe((success) => {
            this.restaurant['location']['lat'] = this.lat;
            this.restaurant['location']['long'] = this.lng;
            this.checkEditLocation = false;
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງແກ້ໄຂຂໍ້ມູນ', {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            }
          });
        }
      });
    } else {
      this.coolDialogs.alert('ຈຸດທີ່ຕັ້ງຍັງບໍ່ປ່ຽນແປງ...', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'OK',
        color: 'black',
        title: 'Warning'
      });
    }
  }
  updateDetail() {
    if (this.updateDetailForm.valid) {
      const data = {
        res_id: this.restaurant['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນລາຍລະອຽດຂອງ \'' + this.restaurant['name'] + '\'',
        _field: {
          detail: this.updateDetailForm.value['res_detail']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນລາຍລະອຽດຂອງຮ້ານອາຫານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.restaurantService.updateRestaurant(data).subscribe((success) => {
            this.restaurant['detail'] = this.updateDetailForm.value['res_detail'];
            this.checkEditDetail = false;
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງແກ້ໄຂຂໍ້ມູນ', {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            }
          });
        }
      });
    } else {
      StaticFunc.triggerForm(this.updateDetailForm);
    }
  }
  updateContact() {
    if (this.updateContactForm.valid) {
      const data = {
        res_id: this.restaurant['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນຈຸດທີ່ຕັ້ງຂອງ \'' + this.restaurant['name'] + '\'',
        _field: {
          tel: this.updateContactForm.value['res_tel'],
          email: this.updateContactForm.value['res_email']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນຕິດຕໍ່ຂອງຮ້ານອາຫານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.restaurantService.updateRestaurant(data).subscribe((success) => {
            this.restaurant['tel'] = this.updateContactForm.value['res_tel'];
            this.restaurant['email'] = this.updateContactForm.value['res_email'];
            this.checkEditContact = false;
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງແກ້ໄຂຂໍ້ມູນ', {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            }
          });
        }
      });
    } else {
      StaticFunc.triggerForm(this.updateContactForm);
    }
  }
  updateVideo() {
    if (this.updateVideoForm.valid) {
      const data = {
        res_id: this.restaurant['_id'],
        title: 'ແກ້ໄຂວີດີໂອ URL ຂອງ \'' + this.restaurant['name'] + '\'',
        _field: {
          video_url: this.updateVideoForm.value['res_video']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂວີດີໂອ URL ຂອງຮ້ານອາຫານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.restaurantService.updateRestaurant(data).subscribe((success) => {
            this.restaurant['video_url'] = this.updateVideoForm.value['res_video'];
            this.checkEditVideo = false;
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງແກ້ໄຂຂໍ້ມູນ', {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            }
          });
        }
      });
    } else {
      StaticFunc.triggerForm(this.updateVideoForm);
    }
  }
  updateSocial() {
    if (this.updateSocailForm.valid) {
      const social_index = this.updateSocailForm.value['idx'];
      const data = {
        res_id: this.restaurant['_id'],
        res_name: this.restaurant['name'],
        social: {
          _id: this.updateSocailForm.value['_id'],
          name: this.updateSocailForm.value['name'],
          url: this.updateSocailForm.value['url']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນສື່ອອນໄລນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.restaurantService.updateSocial(data).subscribe((success) => {
            this.restaurant['socials'][social_index]['name'] = data['social']['name'];
            this.restaurant['socials'][social_index]['url'] = data['social']['url'];
            this.checkEditSocial = false;
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງແກ້ໄຂຂໍ້ມູນ', {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            }
          });
        }
      });
    } else {
      StaticFunc.triggerForm(this.updateSocailForm);
    }
  }
  saveNewSocial() {
    if (this.addNewSocialForm.valid) {
      this.coolDialogs.confirm('ບັນທືກສື່ອອນໄລນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          const data = {
            res_id: this.restaurant['_id'],
            social: this.addNewSocialForm.value
          };
          this.restaurantService.insertSocial(data).subscribe((success) => {
            this.restaurant['socials'].push(success.json()['data']);
            this.addNewSocialForm.reset();
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງບັນທືກຂໍ້ມູນ', {
                theme: 'material', // available themes: 'default' | 'material' | 'dark'
                okButtonText: 'OK',
                color: 'black',
                title: 'Error'
              });
            }
          });
        }
      });
    } else {
      StaticFunc.triggerForm(this.addNewSocialForm);
    }
  }
  updateFood() {
    if (this.updateFoodForm.valid) {

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນອາຫານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          const food_index = this.updateFoodForm.value['idx'];
          this.uploadPercent = 0;
          const new_image = this.updateFoodForm.get('image').value;
          if (new_image.split(':')[0] !== 'https') {
            this.uploadImageChecked = true;
            const foodRef = this.firebaseStorage.ref('Restaurants/Foods');
            const imageObject = new_image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
            const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
            const foodUpload = foodRef.child(imageName).putString(new_image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
            foodUpload.percentageChanges().subscribe((percent) => {
              this.uploadPercent = percent;
              if (percent === 100) {
                setTimeout(() => {
                  const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Restaurants/Foods/' + imageName);
                  imageUrl.getDownloadURL().subscribe((url) => {
                    const image_url = url;
                    this.uploadImageChecked = false;
                    this.savingChecked = true;
                    const data = {
                      res_id: this.restaurant['_id'],
                      res_name: this.restaurant['name'],
                      food: {
                        id: this.updateFoodForm.value['id'],
                        food_name: this.updateFoodForm.value['food_name'],
                        food_type: this.updateFoodForm.value['food_type'],
                        food_price: this.updateFoodForm.value['food_price'],
                        image: image_url
                      }
                    };
                    this.restaurantService.updateFood(data).subscribe((success) => {
                      this.savingChecked = false;
                      this.savedChecked = true;
                      setTimeout(() => {
                        this.restaurant['foods'][food_index]['name'] = data['food']['food_name'];
                        this.restaurant['foods'][food_index]['food_type'] = data['food']['food_type'];
                        this.restaurant['foods'][food_index]['price'] = data['food']['food_price'];
                        this.restaurant['foods'][food_index]['image'] = data['food']['image'];
                        this.updateFoodForm.reset();
                        this.savedChecked = false;
                        this.checkEditFood = false;
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
                        this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງແກ້ໄຂຂໍ້ມູນ', {
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
          } else {
            const data = {
              res_id: this.restaurant['_id'],
              res_name: this.restaurant['name'],
              food: {
                id: this.updateFoodForm.value['id'],
                food_name: this.updateFoodForm.value['food_name'],
                food_type: this.updateFoodForm.value['food_type'],
                food_price: this.updateFoodForm.value['food_price'],
                image: this.updateFoodForm.value['image']
              }
            };
            this.restaurantService.updateFood(data).subscribe((success) => {
              this.savingChecked = false;
              this.savedChecked = true;
              setTimeout(() => {
                this.restaurant['foods'][food_index]['name'] = data['food']['food_name'];
                this.restaurant['foods'][food_index]['price'] = data['food']['food_price'];
                for (let i = 0; i < this.food_types.length; i++) {
                  if (this.food_types[i]['_id'] === data['food']['food_type']) {
                    this.restaurant['foods'][food_index]['food_type'] = this.food_types[i];
                  }
                }
                this.updateFoodForm.reset();
                this.savedChecked = false;
                this.checkEditFood = false;
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
                this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງແກ້ໄຂຂໍ້ມູນ', {
                  theme: 'material', // available themes: 'default' | 'material' | 'dark'
                  okButtonText: 'OK',
                  color: 'black',
                  title: 'Error'
                });
              }
            });
          }
        }
      });
    } else {
      StaticFunc.triggerForm(this.updateFoodForm);
    }
  }
  saveNewFood() {
    if (this.addNewFoodForm.valid) {
      this.coolDialogs.confirm('ບັນທືກເມນູອາຫານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.uploadPercent = 0;
          const new_image = this.addNewFoodForm.get('add_image').value;
          this.uploadImageChecked = true;
          const foodRef = this.firebaseStorage.ref('Restaurants/Foods');
          const imageObject = new_image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
          const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
          const foodUpload = foodRef.child(imageName).putString(new_image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
          foodUpload.percentageChanges().subscribe((percent) => {
            this.uploadPercent = percent;
            if (percent === 100) {
              setTimeout(() => {
                const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Shelters/Rooms/' + imageName);
                imageUrl.getDownloadURL().subscribe((url) => {
                  const image_url = url;
                  this.uploadImageChecked = false;
                  this.savingChecked = true;
                  const data = {
                    res_id: this.restaurant['_id'],
                    food: this.addNewFoodForm.value
                  };
                  this.restaurantService.insertFood(data).subscribe((success) => {
                    this.savingChecked = false;
                    this.savedChecked = true;
                    setTimeout(() => {
                      const new_food = success.json()['data'];
                      for (let i = 0; i < this.food_types.length; i++) {
                        if (this.food_types[i]['_id'] === new_food['food_type']) {
                          new_food['food_type'] = this.food_types[i];
                        }
                      }
                      this.restaurant['foods'].push(new_food);
                      this.addNewSocialForm.reset();
                      this.savedChecked = false;
                      this.checkAddFood = false;
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
                      this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງແກ້ໄຂຂໍ້ມູນ', {
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
    } else {
      StaticFunc.triggerForm(this.addNewFoodForm);
    }
  }

  deleteRestaurant() {
    this.coolDialogs.confirm('ລົບຂໍ້ມູນຮ້ານອາຫານນີ້ແທ້ ຫຼື ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.restaurantService.deleteRestaurant(this.restaurant['_id']).subscribe((success) => {
          this.coolDialogs.alert('ລົບຂໍ້ມູນຮ້ານອາຫານສຳເລັດແລ້ວ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Warning'
          }).subscribe(() => {
            this.router.navigate(['/dashboard', 'restaurant']);
          });
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
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງລົບຂໍຂໍ້ມູນ', {
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

  deleteImage(i, image) {
    this.coolDialogs.confirm('ລົບຮູບນີ້ແທ້ ຫຼື ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        const data = {
          restaurant_id: this.restaurant['_id'],
          imageUrl: image
        };
        this.restaurantService.deleteImage(data).subscribe((success) => {
          this.restaurant['images'].splice(i, 1);
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
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງລົບຮູບພາບ', {
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

  deleteSocial(i, social) {
    this.coolDialogs.confirm('ລົບຂໍ້ມູນສື່ອອນໄລນີ້ແທ້ ຫຼື ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        const data = {
          res_id: this.restaurant['_id'],
          social_id: social['_id']
        };
        this.restaurantService.deleteSocial(data).subscribe((success) => {
          this.restaurant['socials'].splice(i, 1);
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
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງລົບຂໍຂໍ້ມູນ', {
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

  deleteFood(i, food_id) {
    this.coolDialogs.confirm('ລົບຂໍ້ມູນສື່ອອນໄລນີ້ແທ້ ຫຼື ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.restaurantService.deleteFood(food_id, this.restaurant['name']).subscribe((success) => {
          this.restaurant['foods'].splice(i, 1);
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
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງລົບຂໍຂໍ້ມູນ', {
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

  allowPublish() {
    this.coolDialogs.confirm('ຂໍ້ມູນຂອງຮ້ານອາຫານນີ້ຖືກຕ້ອງແລ້ວແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ຖືກຕ້ອງແລ້ວ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Publish'
    }).subscribe((ok) => {
      if (ok) {
        const data = {
          res_id: this.restaurant['_id'],
          title: 'ອະນຸຍາດໃຫ້ຮ້ານອາຫານ ' + this.restaurant['name'] + ' ສະແດງຂຶ້ນສາທາລະນະ',
          _field: {
            published: true
          }
        };
        this.restaurantService.updateRestaurant(data).subscribe((res) => {
          this.restaurant['published'] = true;
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
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດໃນຂະນະຢືນຢັນຂໍ້ມູນ', {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Error'
            });
          } else {
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດໃນຂະນະຢືນຢັນຂໍ້ມູນ', {
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

  sendNotification() {
    this.coolDialogs.confirm('ສົ່ງຂໍ້ມູນຮ້ານອາຫານນີ້ໄປກວດສອບແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ສົ່ງ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Send'
    }).subscribe((res) => {
      if (res) {
        const user_id = JSON.parse(localStorage.getItem('lt_token'))['data']['user_id'];
        const notification_info = {
          user: user_id,
          message: null,
          detail: {
              id: this.restaurant['_id'],
              data: 'ຂໍ້ມູນຮ້ານອາຫານ',
              datastore: 'restaurants',
              title: this.restaurant['name'],
              path: ['/dashboard', 'restaurant', 'detail', this.restaurant['_id']]
          }
        };
        this.notificationService.createNotification(notification_info).subscribe((success) => {
          this.coolDialogs.alert('ສົ່ງໄປກວດສອບສຳເລັດແລ້ວ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Error'
          });
        }, error => {
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
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດໃນຂະນະຢືນຢັນຂໍ້ມູນ', {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Error'
            });
          } else {
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດໃນຂະນະຢືນຢັນຂໍ້ມູນ', {
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

  feedbackNotification() {

    if (!this.feedbackForm.valid) {
      StaticFunc.triggerForm(this.feedbackForm);
      return;
    }

    this.coolDialogs.confirm('ສົ່ງແນະນຳກັບໃຫ້ປັບປຸງຄືນແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ສົ່ງກັບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Feedback'
    }).subscribe((res) => {
      if (res) {
        const user_id = JSON.parse(localStorage.getItem('lt_token'))['data']['user_id'];
        const notification_info = {
          user: user_id,
          message: this.feedbackForm.value['message'],
          detail: {
              id: this.restaurant['_id'],
              data: 'ຂໍ້ມູນຮ້ານອາຫານ',
              datastore: 'restaurants',
              title: this.restaurant['name'],
              path: ['/dashboard', 'restaurant', 'detail', this.restaurant['_id']]
          }
        };
        this.notificationService.createNotification(notification_info).subscribe((success) => {
          this.coolDialogs.alert('ສົ່ງຄືນສຳເລັດແລ້ວ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Error'
          });
        }, error => {
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
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດໃນຂະນະຢືນຢັນຂໍ້ມູນ', {
              theme: 'material', // available themes: 'default' | 'material' | 'dark'
              okButtonText: 'OK',
              color: 'black',
              title: 'Error'
            });
          } else {
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດໃນຂະນະຢືນຢັນຂໍ້ມູນ', {
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
