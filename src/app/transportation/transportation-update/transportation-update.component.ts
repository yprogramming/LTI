import { StaticFunc } from './../../function-usages/static.func';
import { CustomValidators } from 'ng2-validation';
import { TransportationService } from './../../services/transportation.service';
import { AddressService } from './../../services/address.service';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { NgProgress } from 'ngx-progressbar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-transportation-update',
  templateUrl: './transportation-update.component.html',
  styleUrls: ['./transportation-update.component.css']
})
export class TransportationUpdateComponent implements OnInit {

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
  checkAddService = false;
  checkUpdateService = false;
  checkEditService = false;
  checkEditDistances = [];
  checkAddDistance = false;
  uploadImageChecked: Boolean = false;
  savingChecked: Boolean = false;
  savedChecked: Boolean = false;

  // Forms
  updateTittleForm: FormGroup;
  updateAddressForm: FormGroup;
  updateDetailForm: FormGroup;
  updateContactForm: FormGroup;
  updateVideoForm: FormGroup;
  addNewSocialForm: FormGroup;
  updateSocailForm: FormGroup;
  addNewServiceForm: FormGroup;
  updateServiceForm: FormGroup;
  addNewDistanceForm: FormGroup;

  // Address data
  provinces: Array<Object> = [];
  districts: Array<Object> = [];
  villages: Array<string> = [];
  uploadPercent: any;

  // main data
  transportation: Object = {};
  transportation_types: Array<Object> = [];
  v_services: Array<string> = [];
  update_service: Object = {};
  service_name: String = '';
  distance: Object = { };

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
    private transportationService: TransportationService,
    private notificationService: NotificationService
  ) {
    this.progress.start();
    // Create Forms
    this.updateTittleForm = formBuilder.group({
      tran_name: [null, [Validators.required]],
      tran_type: [null, [Validators.required]]
    });
    this.updateAddressForm = formBuilder.group({
      tran_province: [null, [Validators.required]],
      tran_district: [null, [Validators.required]],
      tran_village: [null, [Validators.required]]
    });
    this.updateDetailForm = formBuilder.group({
      tran_detail: [null, [Validators.required]]
    });
    this.updateContactForm = formBuilder.group({
      tran_email: [null],
      tran_tel: [null, [Validators.required]]
    });
    this.updateVideoForm = formBuilder.group({
      tran_video: [null, [Validators.required, CustomValidators.url]]
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
    this.addNewServiceForm = formBuilder.group({
      service_name: [null, [Validators.required]],
      distances: formBuilder.array([this.initDistance()])
    });
    this.addNewDistanceForm = this.initDistance();


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

    this.transportationService.getTransportationTypes().subscribe((types) => {
      this.transportation_types = types.json()['data'];
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
      const tran_id = params.id;
      transportationService.getTransportation(tran_id).subscribe((res) => {
         this.transportation = res.json()['data'];
         this.lat = this.transportation['location']['lat'];
         this.lng = this.transportation['location']['long'];
         this.label = this.transportation['name'];
         for (let i = 0; i < this.transportation['services'].length; i++) {
           this.v_services[i] = this.transportation['services'][i]['vehicle'];
         }
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
    if (this.updateVideoForm.value['tran_video'] && this.updateVideoForm.valid) {
      url = this.updateVideoForm.value['tran_video'];
    } else if (this.transportation['video_url']) {
      url = this.transportation['video_url'];
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

  initDistance() {
    return new FormGroup({
      from: new FormControl(null, [Validators.required]),
      to: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required, Validators.min(0)])
    });
  }
  removeDistance(index) {
    (<FormArray>this.addNewServiceForm.get('distances')).removeAt(index);
  }
  addNewDistance() {
    (<FormArray>this.addNewServiceForm.get('distances')).push(this.initDistance());
  }
  getDistanceLength(){
    return (<FormArray>this.addNewServiceForm.get('distances')).length;
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
  }

  cancelCrop() {
    this.data = {};
    this.cropImageChecked = false;
  }

  croppedImage() {
    const newImage = this.data.image;
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
        const transportationRef = this.firebaseStorage.ref('Restaurant');
        const imageObject = new_image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
        const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
        const transportationUpload = transportationRef.child(imageName).putString(new_image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
        transportationUpload.percentageChanges().subscribe((percent) => {
          this.uploadPercent = percent;
          if (percent === 100) {
            setTimeout(() => {
              const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Restaurant/' + imageName);  // ກຳໜົດ Reference
              imageUrl.getDownloadURL().subscribe((url) => {
                const image_url = url;
                this.uploadImageChecked = false;
                this.savingChecked = true;
                const data = {
                  tran_id: this.transportation['_id'],
                  img_url: image_url
                };

                this.transportationService.insertImage(data).subscribe((success) => {
                  this.savingChecked = false;
                  this.savedChecked = true;
                  setTimeout(() => {
                    this.savedChecked = false;
                    this.cropImageChecked = false;
                    this.transportation['images'].push(image_url);
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
    this.data = {};
  }

  checkPublished() {
    return StaticFunc.published(this.transportation['published']);
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
    this.lat = this.transportation['location']['lat'];
    this.lng = this.transportation['location']['long'];
    this.label = this.transportation['name'];
    this.checkEditLocation = false;
  }

  changeDistrict() {
    const current_province_id = this.updateAddressForm.get('tran_province').value;
    for (let i = 0; i < this.provinces.length; i++) {
      if (this.provinces[i]['_id'] === current_province_id) {
        this.districts = this.provinces[i]['districts'];
        this.updateAddressForm.get('tran_district').setValue(this.districts[0]['_id']);
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
    const current_district_id = this.updateAddressForm.get('tran_district').value;
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
    this.updateTittleForm.get('tran_name').setValue(this.transportation['name']);
    this.updateTittleForm.get('tran_type').setValue(this.transportation['transportation_type']['_id']);
    this.checkEditName = true;
  }

  viewEditAddress() {
    const res_province_id = this.transportation['address']['district']['province']['_id'];
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
    this.updateAddressForm.get('tran_province').setValue(this.transportation['address']['district']['province']['_id']);
    this.updateAddressForm.get('tran_district').setValue(this.transportation['address']['district']['_id']);
    this.updateAddressForm.get('tran_village').setValue(this.transportation['address']['village']);
    this.checkEditAddress = true;
  }

  viewEditDetail() {
    this.updateDetailForm.get('tran_detail').setValue(this.transportation['detail']);
    this.checkEditDetail = true;
  }

  viewEditContact() {
    this.updateContactForm.get('tran_tel').setValue(this.transportation['tel']);
    this.updateContactForm.get('tran_email').setValue(this.transportation['email']);
    this.checkEditContact = true;
  }

  viewEditVideo() {
    this.updateVideoForm.get('tran_video').setValue(this.transportation['video_url']);
    this.checkEditVideo = true;
  }

  viewEditSocial(i, social) {
    this.updateSocailForm.get('idx').setValue(i);
    this.updateSocailForm.get('_id').setValue(social['_id']);
    this.updateSocailForm.get('name').setValue(social['name']);
    this.updateSocailForm.get('url').setValue(social['url']);
    this.checkEditSocial = true;
  }

  viewEditService(i, service) {
    this.update_service['idx'] = i;
    this.update_service['data'] = service;
    this.checkEditService = false;
    this.checkEditDistances = [];
    this.checkUpdateService = true;
  }

  viewUpdateService() {
    this.service_name = this.update_service['vehicle'];
    for (let i = 0; i < this.update_service['data']['distances'].length; i++) {
      this.checkEditDistances[i] = false;
    }
    this.checkEditService = true;
  }
  viewUpdateDistance(i, distance) {
    this.distance = {};
    this.distance = distance;
    for (let j = 0; j < this.update_service['data']['distances'].length; j++) {
      if (j !== i) {
        this.checkEditDistances[j] = false;
      }
    }
    this.checkUpdateService = false;
    this.checkEditDistances[i] = true;
  }

  // Update methods
  updateTitle() {
    if (this.updateTittleForm.valid) {
      const data = {
        tran_id: this.transportation['_id'],
        title: 'ປ່ຽນຊື່ຈາກ ' + this.transportation['name'] + ' ເປັນ ' + this.updateTittleForm.value['tran_name'],
        _field: {
          name: this.updateTittleForm.value['tran_name'],
          transportation_type: this.updateTittleForm.value['tran_type']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຊື່ສະຖານີຂົນສົ່ງໂດຍສານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.transportationService.updateTransportation(data).subscribe((success) => {
            this.transportation['name'] = this.updateTittleForm.value['tran_name'];
            for (let i = 0; i < this.transportation_types.length; i++) {
              if (this.transportation_types[i]['_id'] === this.updateTittleForm.value['tran_type']) {
                this.transportation['transportation_type']['_id'] = this.updateTittleForm.value['tran_type'];
                this.transportation['transportation_type']['name'] = this.transportation_types[i]['name'];
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
        tran_id: this.transportation['_id'],
        tran_name: this.transportation['name'],
        address: this.updateAddressForm.value
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນທີ່ຢູ່ຂອງສະຖານີຂົນສົ່ງໂດຍສານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.transportationService.updateAddress(data).subscribe((success) => {

            const new_data = success.json()['data'];
            this.transportation['address']['village'] = new_data['village'];
            this.transportation['address']['_id'] = new_data['_id'];

            const current_province_id = this.updateAddressForm.get('tran_province').value;
            for (let i = 0; i < this.provinces.length; i++) {
              if (this.provinces[i]['_id'] === current_province_id) {
                this.transportation
                      ['address']
                      ['district']
                      ['province']
                      ['_id'] = this.provinces[i]['_id'];
                this.transportation
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
                this.transportation
                      ['address']
                      ['district']
                      ['_id'] = this.districts[i]['_id'];
                this.transportation
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
    if ((this.lat !== this.transportation['location']['lat'])) {
      const data = {
        tran_id: this.transportation['_id'],
        title: 'ປ່ຽນຈຸດທີ່ຕັ້ງຂອງ \'' + this.transportation['name'] + '\'',
        _field: {
          location: {
            lat: this.lat,
            long: this.lng
          }
        }
      };

      this.coolDialogs.confirm('ປ່ຽນແປງຈຸດທີ່ຕັ້ງຂອງສະຖານີຂົນສົ່ງໂດຍສານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.transportationService.updateTransportation(data).subscribe((success) => {
            this.transportation['location']['lat'] = this.lat;
            this.transportation['location']['long'] = this.lng;
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
        res_id: this.transportation['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນລາຍລະອຽດຂອງ \'' + this.transportation['name'] + '\'',
        _field: {
          detail: this.updateDetailForm.value['tran_detail']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນລາຍລະອຽດຂອງສະຖານີຂົນສົ່ງໂດຍສານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.transportationService.updateTransportation(data).subscribe((success) => {
            this.transportation['detail'] = this.updateDetailForm.value['tran_detail'];
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
        tran_id: this.transportation['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນຈຸດທີ່ຕັ້ງຂອງ \'' + this.transportation['name'] + '\'',
        _field: {
          tel: this.updateContactForm.value['tran_tel'],
          email: this.updateContactForm.value['tran_email']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນຕິດຕໍ່ຂອງສະຖານີຂົນສົ່ງໂດຍສານນີ້ແທ້ ​​​​ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.transportationService.updateTransportation(data).subscribe((success) => {
            this.transportation['tel'] = this.updateContactForm.value['tran_tel'];
            this.transportation['email'] = this.updateContactForm.value['tran_email'];
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
        tran_id: this.transportation['_id'],
        title: 'ແກ້ໄຂວີດີໂອ URL ຂອງ \'' + this.transportation['name'] + '\'',
        _field: {
          video_url: this.updateVideoForm.value['res_video']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂວີດີໂອ URL ຂອງສະຖານນີຂົນສົ່ງໂດຍສານນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.transportationService.updateTransportation(data).subscribe((success) => {
            this.transportation['video_url'] = this.updateVideoForm.value['tran_video'];
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
        tran_id: this.transportation['_id'],
        tran_name: this.transportation['name'],
        social: {
          _id: this.updateSocailForm.value['_id'],
          name: this.updateSocailForm.value['name'],
          url: this.updateSocailForm.value['url']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນສື່ອອນໄລນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.transportationService.updateSocial(data).subscribe((success) => {
            this.transportation['socials'][social_index]['name'] = data['social']['name'];
            this.transportation['socials'][social_index]['url'] = data['social']['url'];
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
      this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນສື່ອອນໄລນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          const data = {
            tran_id: this.transportation['_id'],
            social: this.addNewSocialForm.value
          };
          this.transportationService.insertSocial(data).subscribe((success) => {
            this.transportation['socials'].push(success.json()['data']);
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

  updateService() {
    if (this.service_name.trim()) {
      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນບໍລິການນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          const data = {
            service_id: this.update_service['data']['_id'],
            service_name: this.service_name
          };
          this.transportationService.updateService(data).subscribe((success) => {
            this.transportation['services'][this.update_service['idx']]['vehicle'] = this.service_name;
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
    }
  }

  updateDistance(i) {
    if (this.distance['from'].trim() && this.distance['to'].trim() && this.distance['price'].trim()) {
      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນບໍລິການນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          const data = this.distance;
          this.transportationService.updateDistance(data).subscribe((success) => {
            this.transportation['services'][this.update_service['idx']]['distances'][i]['from'] = data['from'];
            this.transportation['services'][this.update_service['idx']]['distances'][i]['to'] = data['to'];
            this.transportation['services'][this.update_service['idx']]['distances'][i]['price'] = data['price'];
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
      this.coolDialogs.alert('ຕົ້ນທາງ, ປາຍທາງ ແລະ ລາຄາຫ້າມວ່າງ...!', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'OK',
        color: 'black',
        title: 'warning'
      });
    }
  }

  saveNewService() {
    if (this.addNewServiceForm.valid) {
      this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນບໍລິການນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          const data = {
            tran_id: this.transportation['_id'],
            tran_name: this.transportation['name'],
            tran_type_id: this.transportation['transportation_type']['_id'],
            services: this.addNewServiceForm.value
          };
          this.transportationService.insertService(data).subscribe((success) => {
            this.transportation['services'].push(success.json()['data']);
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
      StaticFunc.triggerForm(this.addNewServiceForm);
    }
  }

  saveNewDistance() {
    if (this.addNewDistanceForm.valid) {
      this.coolDialogs.confirm('ບັນທືກຂໍ້ມູນບໍລິການນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ບັນທືກ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          const data = {
            tran_id: this.transportation['_id'],
            service_id: this.update_service['_id'],
            distance: this.addNewDistanceForm.value
          };
          this.transportationService.insertService(data).subscribe((success) => {
            this.transportation['services'].push(success.json()['data']);
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
    }
  }

  deleteTransportation() {
    this.coolDialogs.confirm('ລົບຂໍ້ມູນສະຖານີຂົນສົ່ງໂດຍສານນີ້ແທ້ ຫຼື ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.transportationService.deleteTransportation(this.transportation['_id']).subscribe((success) => {
          this.coolDialogs.alert('ລົບຂໍ້ມູນສະຖານີຂົນສົ່ງໂດຍສານສຳເລັດແລ້ວ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Warning'
          }).subscribe(() => {
            this.router.navigate(['/dashboard', 'transportation']);
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
          transportation_id_id: this.transportation['_id'],
          imageUrl: image
        };
        this.transportationService.deleteImage(data).subscribe((success) => {
          this.transportation['images'].splice(i, 1);
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
          tran_id: this.transportation['_id'],
          social_id: social['_id']
        };
        this.transportationService.deleteSocial(data).subscribe((success) => {
          this.transportation['socials'].splice(i, 1);
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

  deleteService(i, service_id) {
    this.coolDialogs.confirm('ລົບຂໍ້ມູນບໍລິການນີ້ແທ້ ຫຼື ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        const data = {
          tran_id: this.transportation['_id'],
          tran_name: this.transportation['name'],
          service_id: service_id
        };
        this.transportationService.deleteTransportationService(data).subscribe((success) => {
          this.transportation['services'].splice(i, 1);
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

  deleteDistance(i, distance_id) {
    this.coolDialogs.confirm('ລົບຂໍ້ມູນບໍລິການນີ້ແທ້ ຫຼື ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.transportationService.deleteTransportationDistance(distance_id).subscribe((success) => {
          this.transportation['services'][this.update_service['idx']]['distances'][i].splice(i, 1);
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

  sendNotification() {
    const user_id = JSON.parse(localStorage.getItem('lt_token'))['data']['user_id'];
    const notification = {
      user: user_id,
      _command: 'update',
      _detail: {
          id: this.transportation['_id'],
          icon: 'fa-edit',
          data: 'ຂໍ້ມູນສະຖານີຂົນສົ່ງໂດຍສານ',
          datastore: 'transportations',
          title: this.transportation['name'],
          path: ['dashboard', 'transportation', 'detail', this.transportation['_id']]
      }
    };

    this.coolDialogs.confirm('ສົ່ງຂໍ້ມູນໃຫ້ຜູ້ບັນນາທິການກວດສອບບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ສົ່ງ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Send'
    }).subscribe((res) => {
      if (res) {
        
      }
    });

  }

}
