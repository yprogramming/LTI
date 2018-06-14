import { CustomValidators } from 'ng2-validation';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StaticFunc } from './../../function-usages/static.func';
import { AttractionsService } from './../../services/attractions.service';
import { AddressService } from './../../services/address.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { NgProgress } from 'ngx-progressbar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';

@Component({
  selector: 'app-attraction-update',
  templateUrl: './attraction-update.component.html',
  styleUrls: ['./attraction-update.component.css']
})
export class AttractionUpdateComponent implements OnInit {

  // Image cropper
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  data: any;
  cropperSettings: CropperSettings;
  cropImageChecked: Boolean = false;

  // Check properties
  checkEditProfile = false;
  checkEditName = false;
  checkEditPrice = false;
  checkEditAddress = false;
  checkEditLocation = false;
  checkEditDetail = false;
  checkEditRule = false;
  checkEditActivity = false;
  checkEditContact = false;
  checkEditVideo = false;
  checkEditSocial = false;
  checkAddSocial = false;
  uploadImageChecked: Boolean = false;
  savingChecked: Boolean = false;
  savedChecked: Boolean = false;

  // Forms
  updateTittleForm: FormGroup;
  updatePriceForm: FormGroup;
  updateAddressForm: FormGroup;
  updateDetailForm: FormGroup;
  updateRuleForm: FormGroup;
  updateActivityForm: FormGroup;
  updateContactForm: FormGroup;
  updateVideoForm: FormGroup;
  addNewSocialForm: FormGroup;
  updateSocailForm: FormGroup;

  // Address data
  provinces: Array<Object> = [];
  districts: Array<Object> = [];
  villages: Array<string> = [];
  uploadPercent: any;

  // main data
  attractions: Object = {};
  attractions_types: Array<Object> = [];

  // google maps zoom level
  zoom = 8;
  // initial center position for the map
  lat: number;
  lng: number;

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
    private attractionsService: AttractionsService
  ) {

    this.progress.start();

    // Create Forms
    this.updateTittleForm = formBuilder.group({
      att_name: [null, [Validators.required]],
      att_type: [null, [Validators.required]]
    });
    this.updatePriceForm = formBuilder.group({
      att_adult_price: ['', [Validators.required]],
      att_foreign_price: [''],
      att_children_price: ['']
    });
    this.updateAddressForm = formBuilder.group({
      att_province: [null, [Validators.required]],
      att_district: [null, [Validators.required]],
      att_village: [null, [Validators.required]]
    });
    this.updateDetailForm = formBuilder.group({
      att_detail: [null, [Validators.required]]
    });
    this.updateRuleForm = formBuilder.group({
      att_rule: [null, [Validators.required]]
    });
    this.updateActivityForm = formBuilder.group({
      att_activity: [null, [Validators.required]]
    });
    this.updateContactForm = formBuilder.group({
      att_tel: [null, [Validators.required]],
      att_email: [null]
    });
    this.updateVideoForm = formBuilder.group({
      att_video: [null, [Validators.required]]
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

    this.attractionsService.getAttractionsTypes().subscribe((types) => {
      this.attractions_types = types.json()['data'];
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
      const att_id = params.id;
      attractionsService.getAttractions(att_id).subscribe((att) => {
         this.attractions = att.json()['data'];
         this.lat = this.attractions['location']['lat'];
         this.lng = this.attractions['location']['long'];
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
        const attractionsRef = this.firebaseStorage.ref('Attractions');
        const imageObject = new_image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
        const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
        const attractionsUpload = attractionsRef.child(imageName).putString(new_image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
        attractionsUpload.percentageChanges().subscribe((percent) => {
          this.uploadPercent = percent;
          if (percent === 100) {
            setTimeout(() => {
              const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Attractions/' + imageName);  // ກຳໜົດ Reference
              imageUrl.getDownloadURL().subscribe((url) => {
                const image_url = url;
                this.uploadImageChecked = false;
                this.savingChecked = true;
                const data = {
                  att_id: this.attractions['_id'],
                  img_url: image_url
                };

                this.attractionsService.insertImage(data).subscribe((success) => {
                  this.savingChecked = false;
                  this.savedChecked = true;
                  setTimeout(() => {
                    this.savedChecked = false;
                    this.cropImageChecked = false;
                    this.attractions['images'].push(image_url);
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

  setCurrentLocationLatLong() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }

  changeDistrict() {
    const current_province_id = this.updateAddressForm.get('att_province').value;
    for (let i = 0; i < this.provinces.length; i++) {
      if (this.provinces[i]['_id'] === current_province_id) {
        this.districts = this.provinces[i]['districts'];
        this.updateAddressForm.get('att_district').setValue(this.districts[0]['_id']);
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

  cancelLocation() {
    this.lat = this.attractions['location']['lat'];
    this.lng = this.attractions['location']['long'];
    this.checkEditLocation = false;
  }

  viewEditName() {
    this.updateTittleForm.get('att_name').setValue(this.attractions['name']);
    this.updateTittleForm.get('att_type').setValue(this.attractions['attractions_type']['_id']);
    this.checkEditName = true;
  }

  viewEditPrice() {
    this.updatePriceForm.get('att_adult_price').setValue(this.attractions['price']['adult']);
    this.updatePriceForm.get('att_foreign_price').setValue(this.attractions['price']['foriegn']);
    this.updatePriceForm.get('att_children_price').setValue(this.attractions['price']['kid']);
    this.checkEditPrice = true;
  }

  viewEditAddress() {
    const ano_province_id = this.attractions['address']['district']['province']['_id'];
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
    this.updateAddressForm.get('att_province').setValue(this.attractions['address']['district']['province']['_id']);
    this.updateAddressForm.get('att_district').setValue(this.attractions['address']['district']['_id']);
    this.updateAddressForm.get('att_village').setValue(this.attractions['address']['village']);
    this.checkEditAddress = true;
  }

  viewEditDetail() {
    this.updateDetailForm.get('att_detail').setValue(this.attractions['details']);
    this.checkEditDetail = true;
  }

  viewEditRule() {
    this.updateRuleForm.get('att_rule').setValue(this.attractions['rules']);
    this.checkEditRule = true;
  }

  viewEditActivity() {
    this.updateActivityForm.get('att_activity').setValue(this.attractions['activities']);
    this.checkEditActivity = true;
  }

  viewEditContact() {
    this.updateContactForm.get('att_tel').setValue(this.attractions['tel']);
    this.updateContactForm.get('att_email').setValue(this.attractions['email']);
    this.checkEditContact = true;
  }

  viewEditVideo() {
    this.updateVideoForm.get('att_video').setValue(this.attractions['video_url']);
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
        att_id: this.attractions['_id'],
        title: 'ປ່ຽນຊື່ຈາກ ' + this.attractions['name'] + ' ເປັນ ' + this.updateTittleForm.value['att_name'],
        _field: {
          name: this.updateTittleForm.value['att_name'],
          attractions_type: this.updateTittleForm.value['att_type']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຊື່ສະຖານທີ່ທ່ອງທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.attractionsService.updateAttractions(data).subscribe((success) => {
            this.attractions['name'] = this.updateTittleForm.value['att_name'];
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
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

  updatePrice() {
    if (this.updatePriceForm.valid) {
      const data = {
        att_id: this.attractions['_id'],
        title: 'ແກ້ໄຂລາຄາເຂົ້າຊົມຂອງ \'' + this.attractions['name'] + '\'',
        _field: {
          price: {
            adult: this.updatePriceForm.get('att_adult_price').value,
            kid: this.updatePriceForm.get('att_children_price').value,
            foriegn: this.updatePriceForm.get('att_foreign_price').value
          }
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂລາຄາເຂົ້າຊົມຂອງສະຖານທີ່ທ່ອງທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.attractionsService.updateAttractions(data).subscribe((success) => {
            this.attractions['price']['adult'] = this.updatePriceForm.get('att_adult_price').value;
            this.attractions['price']['foriegn'] = this.updatePriceForm.get('att_foreign_price').value;
            this.attractions['price']['kid'] = this.updatePriceForm.get('att_children_price').value;
            this.checkEditPrice = false;
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
        }
      });
    } else {
      StaticFunc.triggerForm(this.updatePriceForm);
    }
  }
  updateAddress() {
    if (this.updateAddressForm.valid) {
      const data = {
        att_id: this.attractions['_id'],
        att_name: this.attractions['name'],
        address: this.updateAddressForm.value
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນທີ່ຢູ່ຂອງສະຖານທີ່ທ່ອງທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.attractionsService.updateAddress(data).subscribe((success) => {

            const new_data = success.json()['data'];
            this.attractions['address']['village'] = new_data['village'];
            this.attractions['address']['_id'] = new_data['_id'];

            const current_province_id = this.updateAddressForm.get('att_province').value;
            for (let i = 0; i < this.provinces.length; i++) {
              if (this.provinces[i]['_id'] === current_province_id) {
                this.attractions
                      ['address']
                      ['district']
                      ['province']
                      ['_id'] = this.provinces[i]['_id'];
                this.attractions
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
                this.attractions
                      ['address']
                      ['district']
                      ['_id'] = this.districts[i]['_id'];
                this.attractions
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
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
    if (this.lat !== this.attractions['location']['lat']) {
      const data = {
        att_id: this.attractions['_id'],
        title: 'ປ່ຽນຈຸດທີ່ຕັ້ງຂອງ \'' + this.attractions['name'] + '\'',
        _field: {
          location: {
            lat: this.lat,
            long: this.lng
          }
        }
      };

      this.coolDialogs.confirm('ປ່ຽນແປງຈຸດທີ່ຕັ້ງຂອງສະຖານທີ່ທ່ອງທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.attractionsService.updateAttractions(data).subscribe((success) => {
            this.attractions['location']['lat'] = this.lat;
            this.attractions['location']['long'] = this.lng;
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
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
        att_id: this.attractions['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນລາຍລະອຽດຂອງ \'' + this.attractions['name'] + '\'',
        _field: {
          details: this.updateDetailForm.value['att_detail']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນລາຍລະອຽດຂອງສະຖານທີ່ທ່ອງທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.attractionsService.updateAttractions(data).subscribe((success) => {
            this.attractions['details'] = this.updateDetailForm.value['att_detail'];
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
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
  updateRule() {
    if (this.updateRuleForm.valid) {
      const data = {
        att_id: this.attractions['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນກົດລະບຽບຂອງ \'' + this.attractions['name'] + '\'',
        _field: {
          rules: this.updateRuleForm.value['att_rule']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນກົດລະບຽບຂອງສະຖານທີ່ທ່ອງທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.attractionsService.updateAttractions(data).subscribe((success) => {
            this.attractions['rules'] = this.updateRuleForm.value['att_rule'];
            this.checkEditRule = false;
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
        }
      });
    } else {
      StaticFunc.triggerForm(this.updateRuleForm);
    }
  }
  updateActivity() {
    console.log(this.updateActivityForm.value);
    if (this.updateActivityForm.valid) {
      const data = {
        att_id: this.attractions['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນກິດຈະກຳຂອງ \'' + this.attractions['name'] + '\'',
        _field: {
          activities: this.updateActivityForm.value['att_activity']
        }
      };

      this.coolDialogs.confirm('ແກ້ໄຂຂໍ້ມູນກິດຈະກຳຂອງສະຖານທີ່ທ່ອງທ່ຽວນີ້ແທ້ ຫຼື ບໍ?', {
        theme: 'material', // available themes: 'default' | 'material' | 'dark'
        okButtonText: 'ແກ້ໄຂ',
        cancelButtonText: 'ຍົກເລີກ',
        color: 'black',
        title: 'Update'
      }).subscribe((res) => {
        if (res) {
          this.attractionsService.updateAttractions(data).subscribe((success) => {
            this.attractions['activities'] = this.updateActivityForm.value['att_activity'];
            this.checkEditRule = false;
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
        }
      });
    } else {
      StaticFunc.triggerForm(this.updateRuleForm);
    }
  }
  updateContact() {
    if (this.updateContactForm.valid) {
      const data = {
        att_id: this.attractions['_id'],
        title: 'ແກ້ໄຂຂໍ້ມູນຈຸດທີ່ຕັ້ງຂອງ \'' + this.attractions['name'] + '\'',
        _field: {
          tel: this.updateContactForm.value['att_tel'],
          email: this.updateContactForm.value['att_email']
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
          this.attractionsService.updateAttractions(data).subscribe((success) => {
            this.attractions['tel'] = this.updateContactForm.value['att_tel'];
            this.attractions['email'] = this.updateContactForm.value['att_email'];
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
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
        att_id: this.attractions['_id'],
        title: 'ແກ້ໄຂວີດີໂອ URL ຂອງ \'' + this.attractions['name'] + '\'',
        _field: {
          video_url: this.updateVideoForm.value['att_video']
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
          this.attractionsService.updateAttractions(data).subscribe((success) => {
            this.attractions['video_url'] = this.updateVideoForm.value['att_video'];
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
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
        att_id: this.attractions['_id'],
        att_name: this.attractions['name'],
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
          this.attractionsService.updateSocial(data).subscribe((success) => {
            this.attractions['socials'][social_index]['name'] = data['social']['name'];
            this.attractions['socials'][social_index]['url'] = data['social']['url'];
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
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
            ano_id: this.attractions['_id'],
            social: this.addNewSocialForm.value
          };
          this.attractionsService.insertSocial(data).subscribe((success) => {
            this.attractions['socials'].push(success.json()['data']);
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
              this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
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

  deleteAttractions() {
    this.coolDialogs.confirm('ໝັ້ນໃຈວ່າຈະລົບຂໍ້ມູນສະຖານທີ່ທ່ອງທ່ຽວນີ້ແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ບັນທືກ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        this.attractionsService.deleteAttractions(this.attractions['_id']).subscribe((success) => {
          this.coolDialogs.alert('ລົບຂໍ້ມູນບໍລິສັດນຳທ່ຽວສຳເລັດແລ້ວ', {
            theme: 'material', // available themes: 'default' | 'material' | 'dark'
            okButtonText: 'OK',
            color: 'black',
            title: 'Warning'
          }).subscribe(() => {
            this.router.navigate(['/dashboard', 'attraction']);
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
            this.coolDialogs.alert('ເກີດຂໍ້ຜິດພາດລະຫວ່າງຮ້ອງຂໍຂໍ້ມູນ', {
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
    this.coolDialogs.confirm('ໝັ້ນໃຈວ່າຈະລົບຮູບນີ້ແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        const data = {
          attractions_id: this.attractions['_id'],
          imageUrl: image
        };
        this.attractionsService.deleteImage(data).subscribe((success) => {
          this.attractions['images'].splice(i, 1);
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
      }
    });
  }

  deleteSocial(i, social) {
    this.coolDialogs.confirm('ໝັ້ນໃຈວ່າຈະລົບສື່ອອນໄລນີ້ແທ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      color: 'black',
      title: 'Delete'
    }).subscribe((res) => {
      if (res) {
        const data = {
          att_id: this.attractions['_id'],
          social_id: social['_id']
        };
        this.attractionsService.deleteSocial(data).subscribe((success) => {
          this.attractions['socials'].splice(i, 1);
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
      }
    });
  }

}
