import { NotificationService } from './../../../services/notification.service';
import { StaticFunc } from './../../../function-usages/static.func';
import { InternetService } from './../../../services/internet.service';
import { AddressService } from './../../../services/address.service';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { NgProgress } from 'ngx-progressbar';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-internet-update',
  templateUrl: './internet-update.component.html',
  styleUrls: ['./internet-update.component.css']
})
export class InternetUpdateComponent implements OnInit {

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
  addNewSocialForm: FormGroup;
  updateSocailForm: FormGroup;
  feedbackForm: FormGroup;
  uploadPercent: any;

  // Address data
  provinces: Array<Object> = [];
  districts: Array<Object> = [];
  villages: Array<string> = [];

  // main data
  internet_center: Object = {};

  // google maps zoom level
  zoom = 8;
  // initial center position for the map
  lat: number;
  lng: number;
  label: string;

  constructor(
    private formBuilder: FormBuilder,
    public progress: NgProgress,
    private firebaseStorage: AngularFireStorage,
    private firebaseStorageRef: AngularFireStorage,
    private router: Router,
    private query: ActivatedRoute,
    private coolDialogs: NgxCoolDialogsService,
    private addressService: AddressService,
    private internetService: InternetService,
    private notificationService: NotificationService
  ) {

    this.progress.start();
    // Create Forms
    this.updateTittleForm = formBuilder.group({
      int_name: [null, [Validators.required]]
    });
    this.updateAddressForm = formBuilder.group({
      int_province: [null, [Validators.required]],
      int_district: [null, [Validators.required]],
      int_village: [null, [Validators.required]]
    });
    this.updateDetailForm = formBuilder.group({
      int_detail: [null, [Validators.required]]
    });
    this.updateContactForm = formBuilder.group({
      int_email: [null],
      int_tel: [null, [Validators.required]]
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
      const int_id = params.id;
      internetService.getInternet(int_id).subscribe((internet_center) => {
         this.internet_center = internet_center.json()['data'];
         this.lat = this.internet_center['location']['lat'];
         this.lng = this.internet_center['location']['long'];
         this.label = this.internet_center['name'];
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
             this.router.navigate(['/dashboard', 'another', 'internet']);
           });
         } else {
           this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
             theme: 'material', // available themes: 'default' | 'material' | 'dark'
             okButtonText: 'OK',
             color: 'black',
             title: 'Error'
           }).subscribe((ok) => {
            this.router.navigate(['/dashboard', 'another', 'internet']);
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
        const internetRef = this.firebaseStorage.ref('Internets');
        const imageObject = new_image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
        const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
        const internetUpload = internetRef.child(imageName).putString(new_image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
        internetUpload.percentageChanges().subscribe((percent) => {
          this.uploadPercent = percent;
          if (percent === 100) {
            setTimeout(() => {
              const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Internets/' + imageName);  // ກຳໜົດ Reference
              imageUrl.getDownloadURL().subscribe((url) => {
                const image_url = url;
                this.uploadImageChecked = false;
                this.savingChecked = true;
                const data = {
                  int_id: this.internet_center['_id'],
                  img_url: image_url
                };

                this.internetService.insertImage(data).subscribe((success) => {
                  this.savingChecked = false;
                  this.savedChecked = true;
                  setTimeout(() => {
                    this.savedChecked = false;
                    this.cropImageChecked = false;
                    this.internet_center['images'].push(image_url);
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
        // this.cropImageChecked = false;
      }
    });
  }

  checkPublished() {
    return StaticFunc.published(this.internet_center['published']);
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
    this.lat = this.internet_center['location']['lat'];
    this.lng = this.internet_center['location']['long'];
    this.label = this.internet_center['name'];
    this.checkEditLocation = false;
  }

  changeDistrict() {
    const current_province_id = this.updateAddressForm.get('int_province').value;
    for (let i = 0; i < this.provinces.length; i++) {
      if (this.provinces[i]['_id'] === current_province_id) {
        this.districts = this.provinces[i]['districts'];
        this.updateAddressForm.get('int_district').setValue(this.districts[0]['_id']);
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
    const current_district_id = this.updateAddressForm.get('int_district').value;
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
    this.updateTittleForm.get('int_name').setValue(this.internet_center['name']);
    this.checkEditName = true;
  }

  viewEditAddress() {
    const ano_province_id = this.internet_center['address']['district']['province']['_id'];
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
    this.updateAddressForm.get('int_province').setValue(this.internet_center['address']['district']['province']['_id']);
    this.updateAddressForm.get('int_district').setValue(this.internet_center['address']['district']['_id']);
    this.updateAddressForm.get('int_village').setValue(this.internet_center['address']['village']);
    this.checkEditAddress = true;
  }

  viewEditDetail() {
    this.updateDetailForm.get('int_detail').setValue(this.internet_center['detail']);
    this.checkEditDetail = true;
  }

  viewEditContact() {
    this.updateContactForm.get('int_tel').setValue(this.internet_center['tel']);
    this.updateContactForm.get('int_email').setValue(this.internet_center['email']);
    this.checkEditContact = true;
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
        int_id: this.internet_center['_id'],
        title: 'ປ່ຽນຊື່ຈາກ ' + this.internet_center['name'] + ' ເປັນ ' + this.updateTittleForm.value['int_name'],
        _field: {
          name: this.updateTittleForm.value['int_name']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຊື່ສູນອິນເຕີເນັດນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.internetService.updateInternet(data).subscribe((success) => {
            this.internet_center['name'] = this.updateTittleForm.value['int_name'];
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
        int_id: this.internet_center['_id'],
        int_name: this.internet_center['name'],
        address: this.updateAddressForm.value
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນທີ່ຢູ່ຂອງສູນອິນເຕີເນັດນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.internetService.updateAddress(data).subscribe((success) => {

            const new_data = success.json()['data'];
            this.internet_center['address']['village'] = new_data['village'];
            this.internet_center['address']['_id'] = new_data['_id'];

            const current_province_id = this.updateAddressForm.get('int_province').value;
            for (let i = 0; i < this.provinces.length; i++) {
              if (this.provinces[i]['_id'] === current_province_id) {
                this.internet_center
                      ['address']
                      ['district']
                      ['province']
                      ['_id'] = this.provinces[i]['_id'];
                this.internet_center
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
                this.internet_center
                      ['address']
                      ['district']
                      ['_id'] = this.districts[i]['_id'];
                this.internet_center
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
    if (this.lat !== this.internet_center['location']['lat']) {
      const data = {
        int_id: this.internet_center['_id'],
        title: 'ປ່ຽນຈຸດທີ່ຕັ້ງຂອງ \'' + this.internet_center['name'] + '\'',
        _field: {
          location: {
            lat: this.lat,
            long: this.lng
          }
        }
      };

      this.coolDialogs.confirm('ປ່ຽນແປງຈຸດທີ່ຕັ້ງຂອງສູນອິນເຕີເນັດນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.internetService.updateInternet(data).subscribe((success) => {
            this.internet_center['location']['lat'] = this.lat;
            this.internet_center['location']['long'] = this.lng;
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
        int_id: this.internet_center['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນລາຍລະອຽດຂອງ \'' + this.internet_center['name'] + '\'',
        _field: {
          detail: this.updateDetailForm.value['int_detail']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນລາຍລະອຽດຂອງສູນອິນເຕີເນັດນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.internetService.updateInternet(data).subscribe((success) => {
            this.internet_center['detail'] = this.updateDetailForm.value['int_detail'];
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
        int_id: this.internet_center['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນຈຸດທີ່ຕັ້ງຂອງ \'' + this.internet_center['name'] + '\'',
        _field: {
          tel: this.updateContactForm.value['int_tel'],
          email: this.updateContactForm.value['int_email']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນຕິດຕໍ່ຂອງສູນອິນເຕີເນັດນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.internetService.updateInternet(data).subscribe((success) => {
            this.internet_center['tel'] = this.updateContactForm.value['int_tel'];
            this.internet_center['email'] = this.updateContactForm.value['int_email'];
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
        int_id: this.internet_center['_id'],
        int_name: this.internet_center['name'],
        social: {
          _id: this.updateSocailForm.value['_id'],
          name: this.updateSocailForm.value['name'],
          url: this.updateSocailForm.value['url']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນສື່ອອນໄລຂອງສູນອິນເຕີເນັດນີ້ແທ້ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.internetService.updateSocial(data).subscribe((success) => {
            this.internet_center['socials'][social_index]['name'] = data['social']['name'];
            this.internet_center['socials'][social_index]['url'] = data['social']['url'];
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
            int_id: this.internet_center['_id'],
            social: this.addNewSocialForm.value
          };
          this.internetService.insertSocial(data).subscribe((success) => {
            console.log(success.json()['data']);
            this.internet_center['socials'].push(success.json()['data']);
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

  deleteInternet() {
    this.coolDialogs.confirm('ລົບຂໍ້ມູນສູນອິນເຕີເນັດນີ້ແທ້ ຫຼື ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ບັນທືກ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.internetService.deleteInternet(this.internet_center['_id']).subscribe((success) => {
          this.coolDialogs.alert('ລົບຂໍ້ມູນສະຖານທີ່ສຳເລັດແລ້ວ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Warning'
          }).subscribe(() => {
            this.router.navigate(['/dashboard', 'internet']);
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
          internet_id: this.internet_center['_id'],
          imageUrl: image
        };
        this.internetService.deleteImage(data).subscribe((success) => {
          this.internet_center['images'].splice(i, 1);
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
    this.coolDialogs.confirm('ລົບສື່ອອນໄລນີ້ແທ້ ຫຼື ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        const data = {
          int_id: this.internet_center['_id'],
          social_id: social['_id']
        };
        this.internetService.deleteSocial(data).subscribe((success) => {
          this.internet_center['socials'].splice(i, 1);
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
    this.coolDialogs.confirm('ຂໍ້ມູນຂອງສູນອິນເຕີເນັດນີ້ຖືກຕ້ອງແລ້ວແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ຖືກຕ້ອງແລ້ວ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Publish'
    }).subscribe((ok) => {
      if (ok) {
        const data = {
          int_id: this.internet_center['_id'],
          title: 'ອະນຸຍາດໃຫ້ສະຖານທີ່ ' + this.internet_center['name'] + ' ສະແດງຂຶ້ນສາທາລະນະ',
          _field: {
            published: true
          }
        };
        this.internetService.updateInternet(data).subscribe((res) => {
          this.internet_center['published'] = true;
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
    this.coolDialogs.confirm('ສົ່ງຂໍ້ມູນສູນອິນເຕີເນັດນີ້ໄປກວດສອບແທ້ບໍ?', {
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
              id: this.internet_center['_id'],
              data: 'ຂໍ້ມູນສູນອິນເຕີເນັດ',
              datastore: 'internets',
              title: this.internet_center['name'],
              path: ['/dashboard', 'another', 'detail', this.internet_center['_id']]
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

    this.coolDialogs.confirm('ສົ່ງກັບໃຫ້ປັບປຸງຄືນແທ້ບໍ?', {
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
              id: this.internet_center['_id'],
              data: 'ຂໍ້ມູນສູນອິນເຕີເນັດ',
              datastore: 'internets',
              title: this.internet_center['name'],
              path: ['/dashboard', 'another', 'internet', 'detail', this.internet_center['_id']]
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
