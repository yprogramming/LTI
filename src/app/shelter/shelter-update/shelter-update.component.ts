import { NotificationService } from './../../services/notification.service';
import { StaticFunc } from './../../function-usages/static.func';
import { CustomValidators } from 'ng2-validation';
import { ShelterService } from './../../services/shelter.service';
import { AddressService } from './../../services/address.service';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { NgProgress } from 'ngx-progressbar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-shelter-update',
  templateUrl: './shelter-update.component.html',
  styleUrls: ['./shelter-update.component.css']
})
export class ShelterUpdateComponent implements OnInit {

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
  checkEditVideo = false;
  checkEditContact = false;
  checkEditSocial = false;
  checkAddSocial = false;
  checkEditRoom = false;
  checkAddRoom = false;
  uploadImageChecked: Boolean = false;
  savingChecked: Boolean = false;
  savedChecked: Boolean = false;
  feedbackChecked: Boolean = false;

  // Forms
  updateTittleForm: FormGroup;
  updateAddressForm: FormGroup;
  updateDetailForm: FormGroup;
  updateVideoForm: FormGroup;
  updateContactForm: FormGroup;
  addNewSocialForm: FormGroup;
  updateSocailForm: FormGroup;
  updateRoomForm: FormGroup;
  addNewRoomForm: FormGroup;
  feedbackForm: FormGroup;


  // Address data
  provinces: Array<Object> = [];
  districts: Array<Object> = [];
  villages: Array<string> = [];
  uploadPercent: any;

  // main data
  shelter: Object = {};
  shelter_types: Array<Object> = [];

  roomIndex: any;

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
    private shelterService: ShelterService,
    private notificationService: NotificationService
  ) {
    this.progress.start();
    // Create Forms
    this.updateTittleForm = formBuilder.group({
      shelt_name: [null, [Validators.required]],
      shelt_type: [null, [Validators.required]]
    });
    this.updateAddressForm = formBuilder.group({
      shelt_province: [null, [Validators.required]],
      shelt_district: [null, [Validators.required]],
      shelt_village: [null, [Validators.required]]
    });
    this.updateDetailForm = formBuilder.group({
      shelt_detail: [null, [Validators.required]]
    });
    this.updateVideoForm = formBuilder.group({
      shelt_video: [null, [Validators.required]]
    });
    this.updateContactForm = formBuilder.group({
      shelt_email: [null],
      shelt_tel: [null, [Validators.required]]
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
    this.updateRoomForm = formBuilder.group({
      idx: [null, [Validators.required]],
      _id: [null, [Validators.required]],
      room_style: [null, [Validators.required]],
      room_price: [null, [Validators.required]],
      image: [null, [Validators.required]]
    });
    this.addNewRoomForm = formBuilder.group({
      style: [null, [Validators.required]],
      price: [null, [Validators.required]],
      room_image: [null, [Validators.required]]
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

    this.shelterService.getShelterTypes().subscribe((types) => {
      this.shelter_types = types.json()['data'];
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
      const shelt_id = params.id;
      shelterService.getShelter(shelt_id).subscribe((shelt) => {
         this.shelter = shelt.json()['data'];
         this.lat = this.shelter['location']['lat'];
         this.lng = this.shelter['location']['long'];
         this.label = this.shelter['name'];
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
             this.router.navigate(['/dashboard', 'shelter']);
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
    } else if (this.shelter['video_url']) {
      url = this.shelter['video_url'];
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
    this.roomIndex = index;
  }

  cancelCrop() {
    this.data = {};
    this.cropImageChecked = false;
  }

  croppedImage() {
    const newImage = this.data.image;
    if ( this.roomIndex === null) {
      this.coolDialogs.confirm('ອັບໂຫຼດ ແລະ ບັນທືກຮູບນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ອັບໂຫຼດ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Add'
      }).subscribe((res) => {
        if (res) {
          this.uploadPercent = 0;
          const new_image = this.data['image'];
          this.uploadImageChecked = true;
          const shelterRef = this.firebaseStorage.ref('Shelters');
          const imageObject = new_image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
          const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
          const shelterUpload = shelterRef.child(imageName).putString(new_image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
          shelterUpload.percentageChanges().subscribe((percent) => {
            this.uploadPercent = percent;
            if (percent === 100) {
              setTimeout(() => {
                const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Shelters/' + imageName);  // ກຳໜົດ Reference
                imageUrl.getDownloadURL().subscribe((url) => {
                  const image_url = url;
                  this.uploadImageChecked = false;
                  this.savingChecked = true;
                  const data = {
                    shelt_id: this.shelter['_id'],
                    img_url: image_url
                  };

                  this.shelterService.insertImage(data).subscribe((success) => {
                    this.savingChecked = false;
                    this.savedChecked = true;
                    setTimeout(() => {
                      this.savedChecked = false;
                      this.cropImageChecked = false;
                      this.shelter['images'].push(image_url);
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
    } else if ( this.roomIndex >= 0 ) {
      this.updateRoomForm.get('image').setValue(newImage);
      this.cropImageChecked = false;
    } else if ( this.roomIndex === 'add') {
      this.addNewRoomForm.get('room_image').setValue(newImage);
      this.cropImageChecked = false;
    }
    this.roomIndex = null;
    this.data = {};
  }

  checkPublished() {
    return StaticFunc.published(this.shelter['published']);
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
    this.lat = this.shelter['location']['lat'];
    this.lng = this.shelter['location']['long'];
    this.label = this.shelter['name'];
    this.checkEditLocation = false;
  }

  changeDistrict() {
    const current_province_id = this.updateAddressForm.get('shelt_province').value;
    for (let i = 0; i < this.provinces.length; i++) {
      if (this.provinces[i]['_id'] === current_province_id) {
        this.districts = this.provinces[i]['districts'];
        this.updateAddressForm.get('shelt_district').setValue(this.districts[0]['_id']);
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
    const current_district_id = this.updateAddressForm.get('shelt_district').value;
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
    this.updateTittleForm.get('shelt_name').setValue(this.shelter['name']);
    this.updateTittleForm.get('shelt_type').setValue(this.shelter['shelter_type']['_id']);
    this.checkEditName = true;
  }

  viewEditAddress() {
    const shelt_province_id = this.shelter['address']['district']['province']['_id'];
    for (let i = 0; i < this.provinces.length; i++) {
      if (this.provinces[i]['_id'] === shelt_province_id) {
        this.districts = this.provinces[i]['districts'];
        this.villages = [];
        const vils = this.districts[0]['villages'];
        for (let k = 0; k < vils.length; k++) {
          this.villages[k] = vils[k].village;
        }
        break;
      }
    }
    this.updateAddressForm.get('shelt_province').setValue(this.shelter['address']['district']['province']['_id']);
    this.updateAddressForm.get('shelt_district').setValue(this.shelter['address']['district']['_id']);
    this.updateAddressForm.get('shelt_village').setValue(this.shelter['address']['village']);
    this.checkEditAddress = true;
  }

  viewEditDetail() {
    this.updateDetailForm.get('shelt_detail').setValue(this.shelter['details']);
    this.checkEditDetail = true;
  }

  viewEditContact() {
    this.updateContactForm.get('shelt_tel').setValue(this.shelter['tel']);
    this.updateContactForm.get('shelt_email').setValue(this.shelter['email']);
    this.checkEditContact = true;
  }

  viewEditVideo() {
    this.updateVideoForm.get('shelt_video').setValue(this.shelter['video_url']);
    this.checkEditVideo = true;
  }

  viewEditSocial(i, social) {
    this.updateSocailForm.get('idx').setValue(i);
    this.updateSocailForm.get('_id').setValue(social['_id']);
    this.updateSocailForm.get('name').setValue(social['name']);
    this.updateSocailForm.get('url').setValue(social['url']);
    this.checkEditSocial = true;
  }

  viewEditRoom(i, room) {
    this.updateRoomForm.get('idx').setValue(i);
    this.updateRoomForm.get('_id').setValue(room['_id']);
    this.updateRoomForm.get('room_style').setValue(room['style']);
    this.updateRoomForm.get('room_price').setValue(room['price']);
    this.updateRoomForm.get('image').setValue(room['room_image']);
    this.checkEditRoom = true;
  }

  // Update methods
  updateTitle() {
    if (this.updateTittleForm.valid) {
      const data = {
        shelt_id: this.shelter['_id'],
        title: 'ປ່ຽນຊື່ຈາກ ' + this.shelter['name'] + ' ເປັນ ' + this.updateTittleForm.value['shelt_name'],
        _field: {
          name: this.updateTittleForm.value['shelt_name'],
          shelter_type: this.updateTittleForm.value['shelt_type']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຊື່ສະຖານທີ່ພັກແຮມນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.shelterService.updateShelter(data).subscribe((success) => {
            this.shelter['name'] = this.updateTittleForm.value['shelt_name'];
            for (let i = 0; i < this.shelter_types.length; i++) {
              if (this.shelter_types[i]['_id'] === this.updateTittleForm.value['shelt_type']) {
                this.shelter['shelter_type']['_id'] = this.updateTittleForm.value['shelt_type'];
                this.shelter['shelter_type']['name'] = this.shelter_types[i]['name'];
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
        shelt_id: this.shelter['_id'],
        shelt_name: this.shelter['name'],
        address: this.updateAddressForm.value
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນທິ່ຢຸ່ຂອງສະຖານທີ່ພັກແຮມນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.shelterService.updateAddress(data).subscribe((success) => {

            const new_data = success.json()['data'];
            this.shelter['address']['village'] = new_data['village'];
            this.shelter['address']['_id'] = new_data['_id'];

            const current_province_id = this.updateAddressForm.get('shelt_province').value;
            for (let i = 0; i < this.provinces.length; i++) {
              if (this.provinces[i]['_id'] === current_province_id) {
                this.shelter
                      ['address']
                      ['district']
                      ['province']
                      ['_id'] = this.provinces[i]['_id'];
                this.shelter
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
                this.shelter
                      ['address']
                      ['district']
                      ['_id'] = this.districts[i]['_id'];
                this.shelter
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
    if ((this.lat !== this.shelter['location']['lat'])) {
      const data = {
        shelt_id: this.shelter['_id'],
        title: 'ປ່ຽນຈຸດທີ່ຕັ້ງຂອງ \'' + this.shelter['name'] + '\'',
        _field: {
          location: {
            lat: this.lat,
            long: this.lng
          }
        }
      };

      this.coolDialogs.confirm('ປ່ຽນແປງຈຸດທີ່ຕັ້ງຂອງສະຖານທີ່ພັກແຮມນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.shelterService.updateShelter(data).subscribe((success) => {
            this.shelter['location']['lat'] = this.lat;
            this.shelter['location']['long'] = this.lng;
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
        shelt_id: this.shelter['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນລາຍລະອຽດຂອງ \'' + this.shelter['name'] + '\'',
        _field: {
          detail: this.updateDetailForm.value['shelt_detail']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນລາຍລະອຽດຂອງສະຖານທີ່ພັກແຮມນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.shelterService.updateShelter(data).subscribe((success) => {
            this.shelter['detail'] = this.updateDetailForm.value['shelt_detail'];
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
  updateVideo() {
    if (this.updateVideoForm.valid) {
      const data = {
        shelt_id: this.shelter['_id'],
        title: 'ແກ້ໄຂວີດີໂອ URL ຂອງ \'' + this.shelter['name'] + '\'',
        _field: {
          video_url: this.updateVideoForm.value['shelt_video']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂວີດີໂອ URL ຂອງສະຖານທີ່ພັກແຮມນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.shelterService.updateShelter(data).subscribe((success) => {
            this.shelter['video_url'] = this.updateVideoForm.value['shelt_video'];
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
  updateContact() {
    if (this.updateContactForm.valid) {
      const data = {
        shelt_id: this.shelter['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນຈຸດທີ່ຕັ້ງຂອງ \'' + this.shelter['name'] + '\'',
        _field: {
          tel: this.updateContactForm.value['shelt_tel'],
          email: this.updateContactForm.value['shelt_email']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນຕິດຕໍ່ຂອງສະຖານທີ່ພັກແຮມນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.shelterService.updateShelter(data).subscribe((success) => {
            this.shelter['tel'] = this.updateContactForm.value['shelt_tel'];
            this.shelter['email'] = this.updateContactForm.value['shelt_email'];
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
  updateSocial() {
    if (this.updateSocailForm.valid) {
      const social_index = this.updateSocailForm.value['idx'];
      const data = {
        shelt_id: this.shelter['_id'],
        shelt_name: this.shelter['name'],
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
          this.shelterService.updateSocial(data).subscribe((success) => {
            this.shelter['socials'][social_index]['name'] = data['social']['name'];
            this.shelter['socials'][social_index]['url'] = data['social']['url'];
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
            shelt_id: this.shelter['_id'],
            social: this.addNewSocialForm.value
          };
          this.shelterService.insertSocial(data).subscribe((success) => {
            this.shelter['socials'].push(success.json()['data']);
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
  updateRoom() {
    if (this.updateRoomForm.valid) {

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນແບບຫ້ອງນອນນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          const room_index = this.updateRoomForm.value['idx'];
          this.uploadPercent = 0;
          const new_image = this.updateRoomForm.get('image').value;
          if (new_image.split(':')[0] !== 'https') {
            this.uploadImageChecked = true;
            const roomRef = this.firebaseStorage.ref('Shelters/Rooms');
            const imageObject = new_image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
            const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
            const roomUpload = roomRef.child(imageName).putString(new_image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
            roomUpload.percentageChanges().subscribe((percent) => {
              this.uploadPercent = percent;
              if (percent === 100) {
                setTimeout(() => {
                  const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Shelters/Rooms/' + imageName);
                  imageUrl.getDownloadURL().subscribe((url) => {
                    const image_url = url;
                    this.uploadImageChecked = false;
                    this.savingChecked = true;
                    const data = {
                      shelt_id: this.shelter['_id'],
                      shelt_name: this.shelter['name'],
                      room: {
                        _id: this.updateRoomForm.value['_id'],
                        room_style: this.updateRoomForm.value['room_style'],
                        room_price: this.updateRoomForm.value['room_price'],
                        image: image_url
                      }
                    };
                    this.shelterService.updateRoom(data).subscribe((success) => {
                      this.savingChecked = false;
                      this.savedChecked = true;
                      setTimeout(() => {
                        this.shelter['rooms'][room_index]['style'] = data['room']['room_style'];
                        this.shelter['rooms'][room_index]['price'] = data['room']['room_price'];
                        this.shelter['rooms'][room_index]['room_image'] = data['room']['image'];
                        this.updateRoomForm.reset();
                        this.savedChecked = false;
                        this.checkEditRoom = false;
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
              shelt_id: this.shelter['_id'],
              shelt_name: this.shelter['name'],
              room: {
                _id: this.updateRoomForm.value['_id'],
                room_style: this.updateRoomForm.value['room_style'],
                room_price: this.updateRoomForm.value['room_price'],
                image: this.updateRoomForm.value['image']
              }
            };
            this.shelterService.updateRoom(data).subscribe((success) => {
              this.shelter['rooms'][room_index]['style'] = data['room']['room_style'];
              this.shelter['rooms'][room_index]['price'] = data['room']['room_price'];
              this.shelter['rooms'][room_index]['room_image'] = data['room']['image'];
              this.checkEditRoom = false;
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
      StaticFunc.triggerForm(this.updateRoomForm);
    }
  }
  saveNewRoom() {
    if (this.addNewRoomForm.valid) {
      this.coolDialogs.confirm('ບັນທືກແບບຫ້ອງນອນນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.uploadPercent = 0;
          const new_image = this.addNewRoomForm.get('room_image').value;
          this.uploadImageChecked = true;
          const roomRef = this.firebaseStorage.ref('Shelters/Rooms');
          const imageObject = new_image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
          const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
          const roomUpload = roomRef.child(imageName).putString(new_image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
          roomUpload.percentageChanges().subscribe((percent) => {
            this.uploadPercent = percent;
            if (percent === 100) {
              setTimeout(() => {
                const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Shelters/Rooms/' + imageName);
                imageUrl.getDownloadURL().subscribe((url) => {
                  const image_url = url;
                  this.uploadImageChecked = false;
                  this.savingChecked = true;
                  const data = {
                    shelt_id: this.shelter['_id'],
                    room: {
                      style: this.addNewRoomForm.value['style'],
                      price: this.addNewRoomForm.value['price'],
                      room_image: image_url
                    }
                  };
                  this.shelterService.insertRoom(data).subscribe((success) => {
                    this.savingChecked = false;
                    this.savedChecked = true;
                    setTimeout(() => {
                      this.shelter['rooms'].push(success.json()['data']);
                      this.addNewSocialForm.reset();
                      this.savedChecked = false;
                      this.checkAddRoom = false;
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
      StaticFunc.triggerForm(this.addNewRoomForm);
    }
  }

  deleteShelter() {
    this.coolDialogs.confirm('ລົບຂໍ້ມູນສະຖານທີ່ພັກແຮມນີ້ແທ້ ຫຼື ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.shelterService.deleteShelter(this.shelter['_id']).subscribe((success) => {
          this.coolDialogs.alert('ລົບຂໍ້ມູນສະຖານທີ່ພັກອາໄສສຳເລັດແລ້ວ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Warning'
          }).subscribe(() => {
            this.router.navigate(['/dashboard', 'shelter']);
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
    this.coolDialogs.confirm('ລົບຮູບຂອງສະຖານທີ່ພັກແຮມນີ້ແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        const data = {
          shelter_id: this.shelter['_id'],
          imageUrl: image
        };
        this.shelterService.deleteImage(data).subscribe((success) => {
          this.shelter['images'].splice(i, 1);
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
    this.coolDialogs.confirm('ລົບຂໍ້ມູນສື່ອອນໄລນີ້ແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        const data = {
          shelt_id: this.shelter['_id'],
          social_id: social['_id']
        };
        this.shelterService.deleteSocial(data).subscribe((success) => {
          this.shelter['socials'].splice(i, 1);
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

  deleteRoom(i, room_id) {
    this.coolDialogs.confirm('ລົບຂໍ້ມູນແບບຫ້ອງນອນນີ້ແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        const data = {
          shelt_id: this.shelter['_id'],
          room_id: room_id
        };
        this.shelterService.deleteRoom(data).subscribe((success) => {
          this.shelter['rooms'].splice(i, 1);
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
    this.coolDialogs.confirm('ຂໍ້ມູນຂອງສະຖານທີ່ພັກແຮມນີ້ຖືກຕ້ອງແລ້ວແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ຖືກຕ້ອງແລ້ວ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Publish'
    }).subscribe((ok) => {
      if (ok) {
        const data = {
          shelt_id: this.shelter['_id'],
          title: 'ອະນຸຍາດໃຫ້ສະຖານທີ່ພັກແຮມ ' + this.shelter['name'] + ' ສະແດງຂຶ້ນສາທາລະນະ',
          _field: {
            published: true
          }
        };
        this.shelterService.updateShelter(data).subscribe((res) => {
          this.shelter['published'] = true;
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
    this.coolDialogs.confirm('ສົ່ງຂໍ້ມູນສະຖານທີ່ພັກແຮມນີ້ໄປກວດສອບແທ້ບໍ?', {
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
              id: this.shelter['_id'],
              data: 'ຂໍ້ມູນສະຖານທີ່ພັກແຮມ',
              datastore: 'shelters',
              title: 'ແກ້ໄຂ' + this.shelter['name'],
              path: ['/dashboard', 'shelter', 'detail', this.shelter['_id']]
          }
        };
        this.notificationService.createNotification(notification_info).subscribe((success) => {
          this.coolDialogs.alert('ສົ່ງໄປກວດສອບສຳເລັດແລ້ວ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Sent'
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

    this.coolDialogs.confirm('ສົ່ງແນະນຳກັບໃຫ້ປັບປຸງຄືນຕາມນີ້ແທ້ບໍ?', {
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
              id: this.shelter['_id'],
              data: 'ຂໍ້ມູນສະຖານທີ່ພັກແຮມ',
              datastore: 'shelters',
              title: 'ປັບປຸງຂໍ້ມູນ' +  this.shelter['name'] + 'ຄືນ',
              path: ['/dashboard', 'shelter', 'detail', this.shelter['_id']]
          }
        };
        this.notificationService.feedbackNotification(notification_info).subscribe((success) => {
          this.coolDialogs.alert('ສົ່ງຄືນສຳເລັດແລ້ວ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Sent'
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
