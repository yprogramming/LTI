import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';

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

  // Forms
  updateTittleForm: FormGroup;
  updateAddressForm: FormGroup;
  updateDetailForm: FormGroup;
  updateContactForm: FormGroup;
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
    })
    this.addNewSocialForm = formBuilder.group({
      int_social_name: [null, [Validators.required]],
      int_social_url: [null, [Validators.required]]
    });
    this.updateSocailForm = formBuilder.group({
      int_social_name: [null, [Validators.required]],
      int_social_url: [null, [Validators.required]]
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
  updateSocial() {
    console.log(this.updateSocailForm.value);
  }
  saveNewSocial() {
    console.log(this.addNewSocialForm.value);
  }
}
