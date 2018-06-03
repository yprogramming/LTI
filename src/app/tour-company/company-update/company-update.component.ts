import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';

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

  // Forms
  updateTittleForm: FormGroup;
  updateAddressForm: FormGroup;
  updateDetailForm: FormGroup;
  updateContactForm: FormGroup;
  updateVideoForm: FormGroup;
  addNewSocialForm: FormGroup;
  updateSocailForm: FormGroup;

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
      com_social_name: [null, [Validators.required]],
      com_social_url: [null, [Validators.required]]
    });
    this.updateSocailForm = formBuilder.group({
      com_social_name: [null, [Validators.required]],
      com_social_url: [null, [Validators.required]]
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

}
