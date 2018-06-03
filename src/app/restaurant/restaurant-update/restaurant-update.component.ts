import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';

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

  foodIndex: any;

  // google maps zoom level
  zoom = 8;
  // initial center position for the map
  lat: number;
  lng: number;
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
    private formBuilder: FormBuilder
  ) {
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
      res_video: [null, [Validators.required]]
    });
    this.addNewSocialForm = formBuilder.group({
      res_social_name: [null, [Validators.required]],
      res_social_url: [null, [Validators.required]]
    });
    this.updateSocailForm = formBuilder.group({
      res_social_name: [null, [Validators.required]],
      res_social_url: [null, [Validators.required]]
    });
    this.updateFoodForm = formBuilder.group({
      food_name: [null, [Validators.required]],
      food_type: [null, [Validators.required]],
      food_price: [null, [Validators.required]],
      image: [null]
    });
    this.addNewFoodForm = formBuilder.group({
      add_food_name: [null, [Validators.required]],
      add_food_type: [null, [Validators.required]],
      add_food_price: [null, [Validators.required]],
      add_image: [null]
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
   }

  ngOnInit() {
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
      console.log('Null condition');
      // this.restaurantForm.value['images'].push(newImage);
    } else if ( this.foodIndex >= 0 ) {
      console.log('Number condition');
      // (<FormGroup>(<FormArray> this.restaurantForm.get('foods')).controls[this.foodIndex]).get('image').setValue(newImage);
    } else if ( this.foodIndex === 'add') {
      console.log('add condition');
    } else {
      console.log('Else condition');
    }
    this.foodIndex = null;
    this.data = {};
    this.cropImageChecked = false;
  }

  // Update methods
  updateTitle() {
    console.log(this.updateTittleForm.value);
  }
  updateAddress() {
    console.log(this.updateAddressForm.value);
  }
  updateDetail() {
    console.log(this.updateDetailForm.value);
  }
  updateContact() {
    console.log(this.updateContactForm.value);
  }
  updateVideo() {
    console.log(this.updateVideoForm.value);
  }
  updateSocial() {
    console.log(this.updateSocailForm.value);
  }
  saveNewSocial() {
    console.log(this.addNewSocialForm.value);
  }
  updateFood() {
    console.log(this.updateFoodForm.value);
  }
  saveNewFood() {
    console.log(this.addNewFoodForm.value);
  }

}
