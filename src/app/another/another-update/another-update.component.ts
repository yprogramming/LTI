import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-another-update',
  templateUrl: './another-update.component.html',
  styleUrls: ['./another-update.component.css']
})
export class AnotherUpdateComponent implements OnInit {

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
      ano_name: [null, [Validators.required]]
    });
    this.updateAddressForm = formBuilder.group({
      ano_province: [null, [Validators.required]],
      ano_district: [null, [Validators.required]],
      ano_village: [null, [Validators.required]]
    });
    this.updateDetailForm = formBuilder.group({
      ano_detail: [null, [Validators.required]]
    });
    this.updateContactForm = formBuilder.group({
      ano_tel: [null, [Validators.required]],
      ano_email: [null]
    });
    this.addNewSocialForm = formBuilder.group({
      ano_social_name: [null, [Validators.required]],
      ano_social_url: [null, [Validators.required]]
    });
    this.updateSocailForm = formBuilder.group({
      ano_social_name: [null, [Validators.required]],
      ano_social_url: [null, [Validators.required]]
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
