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

  roomIndex: any;

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
      shelt_social_name: [null, [Validators.required]],
      shelt_social_url: [null, [Validators.required]]
    });
    this.updateSocailForm = formBuilder.group({
      shelt_social_name: [null, [Validators.required]],
      shelt_social_url: [null, [Validators.required]]
    });
    this.updateRoomForm = formBuilder.group({
      room_style: [null, [Validators.required]],
      room_price: [null, [Validators.required]],
      image: [null]
    });
    this.addNewRoomForm = formBuilder.group({
      add_room_style: [null, [Validators.required]],
      add_room_price: [null, [Validators.required]],
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
    this.roomIndex = index;
  }

  cancelCrop() {
    this.data = {};
    this.cropImageChecked = false;
  }

  croppedImage() {
    const newImage = this.data.image;
    if ( this.roomIndex === null) {
      console.log('Null condition');
      // this.restaurantForm.value['images'].push(newImage);
    } else if ( this.roomIndex >= 0 ) {
      console.log('Number condition');
      // (<FormGroup>(<FormArray> this.restaurantForm.get('rooms')).controls[this.roomIndex]).get('image').setValue(newImage);
    } else if ( this.roomIndex === 'add') {
      console.log('add condition');
    } else {
      console.log('Else condition');
    }
    this.roomIndex = null;
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
  updateVideo() {
    console.log(this.updateVideoForm.value);
  }
  updateContact() {
    console.log(this.updateContactForm.value);
  }
  updateSocial() {
    console.log(this.updateSocailForm.value);
  }
  saveNewSocial() {
    console.log(this.addNewSocialForm.value);
  }
  updateRoom() {
    console.log(this.updateRoomForm.value);
  }
  saveNewRoom() {
    console.log(this.addNewRoomForm.value);
  }

}
