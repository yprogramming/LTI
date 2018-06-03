import { StaticFunc } from './../../function-usages/static.func';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { Subscription } from 'rxjs/Subscription';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

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

  // Upload
  uploadPercentRestaurant: Array<any>;
  uploadPercentFood: Array<any>;
  imageLengthUpload: number;
  imageIndexUpload: number;
  imageUploadMessage: string;
  private subscriptionRestaurants: Array<Subscription>;
  private subscriptionFoods: Array<Subscription>;

  // google maps zoom level
  zoom = 8;
  // initial center position for the map
  lat: number;
  lng: number;

  // create restaurant form
  restaurantForm: FormGroup;
  foodIndex: any;

  villages: Array<Object> = [
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
    private formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage,
    private firebaseStorageRestaurant: AngularFireStorage,
    private firebaseStorageFood: AngularFireStorage
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
      res_email: [null],
      res_tel: [null, [Validators.required]],
      res_video: [null],
      socials: formBuilder.array([this.initSocial()]),
      foods: formBuilder.array([this.initFood()]),
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

    this.subscriptionRestaurants = [];
    this.subscriptionFoods = [];
    this.uploadPercentRestaurant = [];
    this.uploadPercentFood = [];

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
      res_social_name: new FormControl(null, [Validators.required]),
      res_social_url: new FormControl(null, [Validators.required])
    });
  }

  initFood() {
    return new FormGroup({
      food_name: new FormControl(null, [Validators.required]),
      food_type: new FormControl(null, [Validators.required]),
      food_price: new FormControl(null, [Validators.required, Validators.min(0)]),
      image: new FormControl(null)
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
    (<FormArray>this.restaurantForm.get('foods')).push(this.initFood());
  }
  getFoodControls() {
    return (<FormArray>this.restaurantForm.get('foods')).controls;
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

  saveRestaurant() {
    this.imageLengthUpload = this.restaurantForm.value['images'].length;
    this.imageIndexUpload = 0;
    this.uploadPercentRestaurant = [];
    this.uploadPercentFood = [];
    this.imageUploadMessage = 'ກະລຸນາລໍຖ້າ...';
    this.uploadImageChecked = true;
    const foods = this.restaurantForm.value['foods'].slice(0, this.restaurantForm.value['foods'].length);
    if (this.imageLengthUpload > 0) { // ຖ້າມີຮູບທີ່ຈະອັບໂຫຼດ

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
          /*const test = setInterval(() => {
            this.uploadPercentRestaurant[i] += 10;
            if (this.uploadPercentRestaurant[i] === 100) {
              clearInterval(test);
              resolve(foods);
            }
          }, 2000);*/
          const image = this.restaurantForm.value['images'][i]; // ເອົາຮູບຈາກຟອມມາເກັບໄວ້
          const imageObject = image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
          const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
          const anotherUpload = restaurantRef.child(imageName).putString(image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
          this.subscriptionRestaurants[i] = anotherUpload.percentageChanges().subscribe((percent) => {
            this.uploadPercentRestaurant[i] = percent;                                           // ເອົາເປີເຊັນການອັບໂຫຼດຂອງແຕ່ລະຮູບ
            console.log(percent);
            if ( percent === 100) {                                                   // ເມື່ອໃດອັບໂຫລດສຳເລັດ ຮ້ອງຂໍ URL
              this.subscriptionRestaurants[i].unsubscribe();                                    // ຄືນການ subscribe
              setTimeout(() => {
                const imageUrl: AngularFireStorageReference = this.firebaseStorageRestaurant.ref('Restaurants/' + imageName);
                this.subscriptionRestaurants[i] = imageUrl.getDownloadURL().subscribe((url) => {
                  imageUrls[i] = url;                            // ເກັບ URL ຄືນໄວ້ໃນຟອມ
                  this.imageIndexUpload += 1;
                  console.log(i, this.imageIndexUpload);
                  if (this.imageIndexUpload === this.imageLengthUpload) {              // ອັບໂຫຼດໝົດເມື່ອໃດ ອອກຈາກໂພຼມິດສ໌ນີ້ທັງທີ່
                    resolve({restaurantImages: imageUrls, newFoods: foods});
                  }
                  this.subscriptionRestaurants[i].unsubscribe();
                }, (error) => {
                  this.subscriptionRestaurants[i].unsubscribe();
                  reject(error);
                });
              }, 3000);
            }
          });
        }

        for (let i = 0; i < foods.length; i++) {
          this.uploadPercentFood[i] = 0;
          if (foods[i].image !== null) {
            /*const test = setInterval(() => {
              this.uploadPercentFood[i] += 10;
              if (this.uploadPercentFood[i] === 100) {
                clearInterval(test);
                resolve(foods);
              }
            }, 2000);*/
            const image = foods[i].image; // ເອົາຮູບຈາກຟອມມາເກັບໄວ້
            const imageObject = image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
            const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
            const anotherUpload = restaurantRef.child('Foods').child(imageName).putString(image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Storage
            this.subscriptionFoods[i] = anotherUpload.percentageChanges().subscribe((percent) => {
              this.uploadPercentFood[i] = percent;
              if ( percent === 100) {                                                   // ເມື່ອໃດອັບໂຫລດສຳເລັດ ຮ້ອງຂໍ URL
                this.subscriptionFoods[i].unsubscribe();                                    // ຄືນການ subscribe
                setTimeout(() => {
                  const imageUrl: AngularFireStorageReference = this.firebaseStorageFood.ref('Restaurants/Foods/' + imageName);
                  this.subscriptionFoods[i] = imageUrl.getDownloadURL().subscribe((url) => {
                    foods[i].image = url;                            // ເກັບ URL ຄືນໄວ້ໃນຟອມ
                    this.imageIndexUpload += 1;
                    console.log(i, this.imageIndexUpload);
                    if (this.imageIndexUpload === this.imageLengthUpload) {              // ອັບໂຫຼດໝົດເມື່ອໃດ ອອກຈາກໂພຼມິດສ໌ນີ້ທັງທີ່
                      resolve({restaurantImages: imageUrls, newFoods: foods});
                    }
                    this.subscriptionFoods[i].unsubscribe();
                  }, (error) => {
                    this.subscriptionFoods[i].unsubscribe();
                    reject(error);
                  });
                }, 3000);
              }
            });
          }
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
            this.restaurantForm.value['socials'].splice(1, 1);
            this.restaurantForm.value['foods'].splice(1, 1);
            this.restaurantForm.reset();
          }, 3000);
        }, 5000);
      }).catch((error) => {
        console.log(error);
      });
    }
  }
}
