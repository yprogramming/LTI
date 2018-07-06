import { NotificationService } from './../../services/notification.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StaticFunc } from './../../function-usages/static.func';
import { CompanyService } from './../../services/company.service';
import { AddressService } from './../../services/address.service';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { NgProgress } from 'ngx-progressbar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-update',
  templateUrl: './company-update.component.html',
  styleUrls: ['./company-update.component.css']
})
export class CompanyUpdateComponent implements OnInit {

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
  feedbackForm: FormGroup;
  uploadPercent: any;

  // Address data
  provinces: Array<Object> = [];
  districts: Array<Object> = [];
  villages: Array<string> = [];

  // main data
  tour_company: Object = {};

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
    private tourCompanyService: CompanyService,
    private notificationService: NotificationService
  ) {

    this.progress.start();

    // Create Forms
    this.updateTittleForm = formBuilder.group({
      com_name: [null, [Validators.required]]
    });
    this.updateAddressForm = formBuilder.group({
      com_province: [null, [Validators.required]],
      com_district: [null, [Validators.required]],
      com_village: [null, [Validators.required]]
    });
    this.updateDetailForm = formBuilder.group({
      com_detail: [null, [Validators.required]]
    });
    this.updateVideoForm = formBuilder.group({
      com_video: [null, [Validators.required]]
    });
    this.updateContactForm = formBuilder.group({
      com_email: [null],
      com_tel: [null, [Validators.required]]
    });
    this.addNewSocialForm = formBuilder.group({
      name: [null, [Validators.required]],
      url: [null, [Validators.required]]
    });
    this.updateSocailForm = formBuilder.group({
      idx: [null, [Validators.required]],
      _id: [null, [Validators.required]],
      name: [null, [Validators.required]],
      url: [null, [Validators.required]]
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

    query.params.subscribe((params) => {
      if (params.id) {
      const com_id = params.id;
      tourCompanyService.getTourCompany(com_id).subscribe((tour_company) => {
         this.tour_company = tour_company.json()['data'];
         this.lat = this.tour_company['location']['lat'];
         this.lng = this.tour_company['location']['long'];
         this.label = this.tour_company['name'];
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
             this.router.navigate(['/dashboard', 'company']);
           });
         } else {
           this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
             theme: 'material', // available themes: 'default' | 'material' | 'dark'
             okButtonText: 'OK',
             color: 'black',
             title: 'Error'
           }).subscribe((ok) => {
            this.router.navigate(['/dashboard', 'company']);
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
    } else if (this.tour_company['video_url']) {
      url = this.tour_company['video_url'];
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
        const companyRef = this.firebaseStorage.ref('Companies');
        const imageObject = new_image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
        const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
        const companyUpload = companyRef.child(imageName).putString(new_image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
        companyUpload.percentageChanges().subscribe((percent) => {
          this.uploadPercent = percent;
          if (percent === 100) {
            setTimeout(() => {
              const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Companies/' + imageName);  // ກຳໜົດ Reference
              imageUrl.getDownloadURL().subscribe((url) => {
                const image_url = url;
                this.uploadImageChecked = false;
                this.savingChecked = true;
                const data = {
                  ano_id: this.tour_company['_id'],
                  img_url: image_url
                };

                this.tourCompanyService.insertImage(data).subscribe((success) => {
                  this.savingChecked = false;
                  this.savedChecked = true;
                  setTimeout(() => {
                    this.savedChecked = false;
                    this.cropImageChecked = false;
                    this.tour_company['images'].push(image_url);
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

  checkPublished() {
    return StaticFunc.published(this.tour_company['published']);
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
    this.lat = this.tour_company['location']['lat'];
    this.lng = this.tour_company['location']['long'];
    this.label = this.tour_company['name'];
    this.checkEditLocation = false;
  }

  changeDistrict() {
    const current_province_id = this.updateAddressForm.get('ano_province').value;
    for (let i = 0; i < this.provinces.length; i++) {
      if (this.provinces[i]['_id'] === current_province_id) {
        this.districts = this.provinces[i]['districts'];
        this.updateAddressForm.get('ano_district').setValue(this.districts[0]['_id']);
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
    const current_district_id = this.updateAddressForm.get('ano_district').value;
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
    this.updateTittleForm.get('com_name').setValue(this.tour_company['name']);
    this.checkEditName = true;
  }

  viewEditAddress() {
    const ano_province_id = this.tour_company['address']['district']['province']['_id'];
    for (let i = 0; i < this.provinces.length; i++) {
      if (this.provinces[i]['_id'] === ano_province_id) {
        this.districts = this.provinces[i]['districts'];
        this.villages = [];
        const vils = this.districts[0]['villages'];
        for (let k = 0; k < vils.length; k++) {
          this.villages[k] = vils[k].village;
        }
        break;
      }
    }
    this.updateAddressForm.get('com_province').setValue(this.tour_company['address']['district']['province']['_id']);
    this.updateAddressForm.get('com_district').setValue(this.tour_company['address']['district']['_id']);
    this.updateAddressForm.get('com_village').setValue(this.tour_company['address']['village']);
    this.checkEditAddress = true;
  }

  viewEditDetail() {
    this.updateDetailForm.get('com_detail').setValue(this.tour_company['about']);
    this.checkEditDetail = true;
  }

  viewEditContact() {
    this.updateContactForm.get('com_tel').setValue(this.tour_company['tel']);
    this.updateContactForm.get('com_email').setValue(this.tour_company['email']);
    this.checkEditContact = true;
  }

  viewEditVideo() {
    this.updateVideoForm.get('com_video').setValue(this.tour_company['video_url']);
    this.checkEditVideo = true;
  }

  viewEditSocial(i, social) {
    this.updateSocailForm.get('idx').setValue(i);
    this.updateSocailForm.get('_id').setValue(social['_id']);
    this.updateSocailForm.get('name').setValue(social['name']);
    this.updateSocailForm.get('url').setValue(social['url']);
    this.checkEditSocial = true;
  }

  // Update methods
  updateTitle() {
    if (this.updateTittleForm.valid) {
      const data = {
        com_id: this.tour_company['_id'],
        title: 'ປ່ຽນຊື່ຈາກ ' + this.tour_company['name'] + ' ເປັນ ' + this.updateTittleForm.value['com_name'],
        _field: {
          name: this.updateTittleForm.value['com_name']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຊື່ບໍລິສັດນຳທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.tourCompanyService.updateTourCompany(data).subscribe((success) => {
            this.tour_company['name'] = this.updateTittleForm.value['com_name'];
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
        com_id: this.tour_company['_id'],
        com_name: this.tour_company['name'],
        address: this.updateAddressForm.value
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນທີ່ຢູ່ຂອງບໍລິສັດນຳທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.tourCompanyService.updateAddress(data).subscribe((success) => {

            const new_data = success.json()['data'];
            this.tour_company['address']['village'] = new_data['village'];
            this.tour_company['address']['_id'] = new_data['_id'];

            const current_province_id = this.updateAddressForm.get('com_province').value;
            for (let i = 0; i < this.provinces.length; i++) {
              if (this.provinces[i]['_id'] === current_province_id) {
                this.tour_company
                      ['address']
                      ['district']
                      ['province']
                      ['_id'] = this.provinces[i]['_id'];
                this.tour_company
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
                this.tour_company
                      ['address']
                      ['district']
                      ['_id'] = this.districts[i]['_id'];
                this.tour_company
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
    if (this.lat !== this.tour_company['location']['lat']) {
      const data = {
        com_id: this.tour_company['_id'],
        title: 'ປ່ຽນຈຸດທີ່ຕັ້ງຂອງ \'' + this.tour_company['name'] + '\'',
        _field: {
          location: {
            lat: this.lat,
            long: this.lng
          }
        }
      };

      this.coolDialogs.confirm('ປ່ຽນແປງຈຸດທີ່ຕັ້ງຂອງບໍລິສັດນຳທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.tourCompanyService.updateTourCompany(data).subscribe((success) => {
            this.tour_company['location']['lat'] = this.lat;
            this.tour_company['location']['long'] = this.lng;
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
        com_id: this.tour_company['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນກ່ຽວກັບບໍລິສັດຂອງ \'' + this.tour_company['name'] + '\'',
        _field: {
          about: this.updateDetailForm.value['com_detail']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນລາຍລະອຽດຂອງບໍລິສັດນຳທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.tourCompanyService.updateTourCompany(data).subscribe((success) => {
            this.tour_company['about'] = this.updateDetailForm.value['com_detail'];
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
        com_id: this.tour_company['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນຈຸດທີ່ຕັ້ງຂອງ \'' + this.tour_company['name'] + '\'',
        _field: {
          tel: this.updateContactForm.value['com_tel'],
          email: this.updateContactForm.value['com_email']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນຕິດຕໍ່ຂອງບໍລິສັດນຳທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.tourCompanyService.updateTourCompany(data).subscribe((success) => {
            this.tour_company['tel'] = this.updateContactForm.value['com_tel'];
            this.tour_company['email'] = this.updateContactForm.value['com_email'];
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
        com_id: this.tour_company['_id'],
        title: 'ແກ້ໄຂວີດີໂອ URL ຂອງ \'' + this.tour_company['name'] + '\'',
        _field: {
          video_url: this.updateVideoForm.value['com_video']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂວີດີໂອ URL ຂອງບໍລິສັດນຳທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.tourCompanyService.updateTourCompany(data).subscribe((success) => {
            this.tour_company['video_url'] = this.updateVideoForm.value['com_video'];
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
      StaticFunc.triggerForm(this.updateContactForm);
    }
  }
  updateSocial() {
    if (this.updateSocailForm.valid) {
      const social_index = this.updateSocailForm.value['idx'];
      const data = {
        com_id: this.tour_company['_id'],
        com_name: this.tour_company['name'],
        social: {
          _id: this.updateSocailForm.value['_id'],
          name: this.updateSocailForm.value['name'],
          url: this.updateSocailForm.value['url']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນສື່ອອນໄລຂອງບໍລິສັດນຳທ່ຽວນີ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.tourCompanyService.updateSocial(data).subscribe((success) => {
            this.tour_company['socials'][social_index]['name'] = data['social']['name'];
            this.tour_company['socials'][social_index]['url'] = data['social']['url'];
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
            ano_id: this.tour_company['_id'],
            social: this.addNewSocialForm.value
          };
          this.tourCompanyService.insertSocial(data).subscribe((success) => {
            this.tour_company['socials'].push(success.json()['data']);
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


  deleteCompany() {
    this.coolDialogs.confirm('ລົບຂໍ້ມູນບໍລິສັດນຳທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ບັນທືກ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.tourCompanyService.deleteTourCompany(this.tour_company['_id']).subscribe((success) => {
          this.coolDialogs.alert('ລົບຂໍ້ມູນບໍລິສັດນຳທ່ຽວສຳເລັດແລ້ວ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Warning'
          }).subscribe(() => {
            this.router.navigate(['/dashboard', 'company']);
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
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງລົບຂໍ້ມູນ', {
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
          internet_id: this.tour_company['_id'],
          imageUrl: image
        };
        this.tourCompanyService.deleteImage(data).subscribe((success) => {
          this.tour_company['images'].splice(i, 1);
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
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງລົບຂໍ້ມູນ', {
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
          int_id: this.tour_company['_id'],
          social_id: social['_id']
        };
        this.tourCompanyService.deleteSocial(data).subscribe((success) => {
          this.tour_company['socials'].splice(i, 1);
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
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງລົບຂໍ້ມູນ', {
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
    this.coolDialogs.confirm('ຂໍ້ມູນຂອງບໍລິສັດນຳທ່ຽວນີ້ຖືກຕ້ອງແລ້ວແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ຖືກຕ້ອງແລ້ວ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Publish'
    }).subscribe((ok) => {
      if (ok) {
        const data = {
          com_id: this.tour_company['_id'],
          title: 'ອະນຸຍາດໃຫ້ບໍລິສັດນຳທ່ຽວ ' + this.tour_company['name'] + ' ສະແດງຂຶ້ນສາທາລະນະ',
          _field: {
            published: true
          }
        };
        this.tourCompanyService.updateTourCompany(data).subscribe((res) => {
          this.tour_company['published'] = true;
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
    this.coolDialogs.confirm('ສົ່ງຂໍ້ມູນບໍລິສັດນຳທ່ຽວນີ້ໄປກວດສອບແທ້ບໍ?', {
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
              id: this.tour_company['_id'],
              data: 'ຂໍ້ມູນບໍລິສັດນຳທ່ຽວ',
              datastore: 'tourcompanies',
              title: 'ແກ້ໄຂ' + this.tour_company['name'],
              path: ['/dashboard', 'shelter', 'detail', this.tour_company['_id']]
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
              id: this.tour_company['_id'],
              data: 'ຂໍ້ມູນບໍລິສັດນຳທ່ຽວ',
              datastore: 'tourcompanies',
              title: 'ປັບປຸງຂໍ້ມູນ' +  this.tour_company['name'] + 'ຄືນ',
              path: ['/dashboard', 'company', 'detail', this.tour_company['_id']]
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
