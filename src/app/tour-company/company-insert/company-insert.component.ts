import { StaticFunc } from './../../function-usages/static.func';
import { AngularFireStorage } from 'angularfire2/storage';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-company-insert',
  templateUrl: './company-insert.component.html',
  styleUrls: ['./company-insert.component.css']
})
export class CompanyInsertComponent implements OnInit {

  // Image cropper
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  data: any;
  cropperSettings: CropperSettings;
  cropImageChecked: Boolean = false;
  uploadImageChecked: Boolean = false;
  savingChecked: Boolean = false;
  savedChecked: Boolean = false;

  // Upload
  uploadPercent: Array<any>;
  imageLengthUpload: number;
  imageIndexUpload: number;
  imageUploadMessage: string;
  private subscriptions: Array<Subscription>;

  // Form
  companyTourForm: FormGroup;

  // google maps zoom level
  zoom = 8;
  // initial center position for the map
  lat: number;
  lng: number;
  villages: Array<String> = [
    'Village A',
    'Village B',
    'Village C',
    'Village D',
    'Village E',
    'Village A',
    'Village B',
    'Village C',
    'Village D',
    'Village E'
  ];
  constructor(
    formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage,
    private firebaseStorageRef: AngularFireStorage
  ) {
    this.companyTourForm = formBuilder.group({
      com_name: [null, [Validators.required]],
      com_province: [null, [Validators.required]],
      com_district: [null, [Validators.required]],
      com_village: [null, [Validators.required]],
      com_lat: [null, [Validators.required]],
      com_long: [null, [Validators.required]],
      com_about: [null],
      com_email: [null],
      com_tel: [null, [Validators.required]],
      socials: formBuilder.array([this.initSocial()]),
      images: formBuilder.array([]),
      com_video: [null]
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

    this.subscriptions = [];
    this.uploadPercent = [];
   }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }

  initSocial() {
    return new FormGroup({
      com_social_name: new FormControl(null, [Validators.required]),
      com_social_url: new FormControl(null, [Validators.required])
    });
  }

  removeSocial(index) {
    (<FormArray>this.companyTourForm.get('socials')).removeAt(index);
  }
  addNewSocial() {
    (<FormArray>this.companyTourForm.get('socials')).push(this.initSocial());
  }
  socialLength() {
    return (<FormArray>this.companyTourForm.get('socials')).length;
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
    this.companyTourForm.value['images'].push(newImage);
    this.data = {};
    this.cropImageChecked = false;
  }

  saveCompanyTour() {
    // if (this.anotherForm.valid) {
      console.log(this.companyTourForm.value);
      this.imageLengthUpload = this.companyTourForm.value['images'].length;
    this.imageIndexUpload = 0;
    this.uploadPercent = [];
    this.imageUploadMessage = 'ກະລຸນາລໍຖ້າ...';
    this.uploadImageChecked = true;
    if (this.imageLengthUpload > 0) { // ຖ້າມີຮູບທີ່ຈະອັບໂຫຼດ
      const anotherRef = this.firebaseStorage.ref('Anothers'); // ກຳນົດ Path ທີ່ຢູ່ຂອງຮູບໃນ Firebase Storage
      const uploadingImages = new Promise((resolve, reject) => { // ສ້າງໂພຼມິດທີ່ໃຊ້ກວດສອບວ່າອັບໂຫລດຮູບໝົດຫຼືຍັງ
        const imageUrls: Array<string> = [];
        for (let i = 0; i < this.imageLengthUpload; i++) {
          this.uploadPercent[i] = 0;
          const test = setInterval(() => {
            this.uploadPercent[i] += 10;
            if (this.uploadPercent[i] === 100) {
              clearInterval(test);
              resolve('OK all images are uploaded to storage');
            }
          }, 2000);
          /*const image = this.companyTourForm.value['images'][i]; // ເອົາຮູບຈາກຟອມມາເກັບໄວ້
          const imageObject = image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
          const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
          const anotherUpload = anotherRef.child(imageName).putString(image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
          this.subscriptions[i] = anotherUpload.percentageChanges().subscribe((percent) => {
            this.uploadPercent[i] = percent;                                                  // ເອົາເປີເຊັນການອັບໂຫຼດຂອງແຕ່ລະຮູບ
            console.log(percent);
            if ( percent === 100) {                                                   // ເມື່ອໃດອັບໂຫລດສຳເລັດ ຮ້ອງຂໍ URL
              this.subscriptions[i].unsubscribe();                                    // ຄືນການ subscribe
              setTimeout(() => {
                const imageUrl: AngularFireStorageReference = this.firebaseStorageRef.ref('Anothers/' + imageName);  // ກຳໜົດ Reference
                this.subscriptions[i] = imageUrl.getDownloadURL().subscribe((url) => {
                  imageUrls[i] = url;                            // ເກັບ URL ຄືນໄວ້ໃນຟອມ
                  this.imageIndexUpload += 1;
                  console.log(i, this.imageIndexUpload);
                  if (this.imageIndexUpload === this.imageLengthUpload) {              // ອັບໂຫຼດໝົດເມື່ອໃດ ອອກຈາກໂພຼມິດສ໌ນີ້ທັງທີ່
                    resolve(imageUrls);
                  }
                  this.subscriptions[i].unsubscribe();
                });
              }, 3000);
            }
          });*/
        }
      });
      uploadingImages.then((data) => {     // ເມື່ອຈົບການອັບໂຫຼດຮູບໃຫ້ບັນທຶກຂໍ້ມູນລົງໃນຖານຂໍ້ມູນ
        this.imageUploadMessage = 'ກຳລັງບັນທຶກຂໍ້ມູນ...';
        this.savingChecked = true;
        setTimeout(() => {
          this.savingChecked = false;
          this.savedChecked = true;
          setTimeout(() => {
            console.log(data);
            console.log(StaticFunc.ramdomText());
            this.savedChecked = false;
            this.uploadImageChecked = false;
            this.companyTourForm.reset();
          }, 3000);
        }, 5000);
      });
    }
    console.log('Everything is successfully');
  }
}
