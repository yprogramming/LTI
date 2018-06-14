import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-transportation-update',
  templateUrl: './transportation-update.component.html',
  styleUrls: ['./transportation-update.component.css']
})
export class TransportationUpdateComponent implements OnInit {

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
  checkAddService = false;
  checkUpdateService = false;

  // Forms
  updateTittleForm: FormGroup;
  updateAddressForm: FormGroup;
  updateDetailForm: FormGroup;
  updateContactForm: FormGroup;
  updateVideoForm: FormGroup;
  addNewSocialForm: FormGroup;
  updateSocailForm: FormGroup;
  addNewServiceForm: FormGroup;
  updateServiceForm: FormGroup;

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
      tran_name: [null, [Validators.required]],
      tran_type: [null, [Validators.required]]
    });
    this.updateAddressForm = formBuilder.group({
      tran_province: [null, [Validators.required]],
      tran_district: [null, [Validators.required]],
      tran_village: [null, [Validators.required]]
    });
    this.updateDetailForm = formBuilder.group({
      tran_detail: [null, [Validators.required]]
    });
    this.updateContactForm = formBuilder.group({
      tran_email: [null],
      tran_tel: [null, [Validators.required]]
    });
    this.updateVideoForm = formBuilder.group({
      tran_video: [null, [Validators.required]]
    });
    this.addNewSocialForm = formBuilder.group({
      name: [null, [Validators.required]],
      url: [null, [Validators.required]]
    });
    this.updateSocailForm = formBuilder.group({
      name: [null, [Validators.required]],
      url: [null, [Validators.required]]
    });
    this.addNewServiceForm = formBuilder.group({
      service_name: [null, [Validators.required]],
      distances: formBuilder.array([this.initDistance()])
    });
    this.updateServiceForm = formBuilder.group({
      service_name: [null, [Validators.required]],
      distances: formBuilder.array([this.initDistance()])
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

  addNewService() {

    this.checkAddService = true;
  }

  initDistance() {
    return new FormGroup({
      from: new FormControl(null, [Validators.required]),
      to: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required, Validators.min(0)])
    });
  }
  removeDistance(index) {
    (<FormArray>this.addNewServiceForm.get('distances')).removeAt(index);
  }
  addNewDistance() {
    (<FormArray>this.addNewServiceForm.get('distances')).push(this.initDistance());
  }
  getDistanceLength(){
    return (<FormArray>this.addNewServiceForm.get('distances')).length;
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
  }

  cancelCrop() {
    this.data = {};
    this.cropImageChecked = false;
  }

  croppedImage() {
    const newImage = this.data.image;
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
  saveNewService() {
    console.log(this.addNewServiceForm.value);
  }

}
