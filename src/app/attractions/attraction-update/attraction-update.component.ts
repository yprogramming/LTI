import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxCoolDialogsService } from 'ngx-cool-dialogs';
import { Subscription } from 'rxjs/Subscription';

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

  // Subscription
  alertSubscription: Subscription;

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
    private formBuilder: FormBuilder,
    private coolDialogs: NgxCoolDialogsService
  ) {
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
      att_social_name: [null, [Validators.required]],
      att_social_url: [null, [Validators.required]]
    });
    this.updateSocailForm = formBuilder.group({
      att_social_name: [null, [Validators.required]],
      att_social_url: [null, [Validators.required]]
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
    this.alertSubscription = this.coolDialogs.confirm('ອັບໂຫຼດ ແລະ ບັນທືກຮູບນີ້ບໍ?', {
      theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'ອັບໂຫຼດ',
      cancelButtonText: 'ບໍ່ອັບໂຫຼດ',
      color: 'black',
      title: 'Image'
    }).subscribe((res) => {
      if (res) {
        console.log('Yes Button');
      this.cropImageChecked = false;
      } else {
        console.log('No button');
      }
      this.alertSubscription.unsubscribe();
    });
  }

  // Update methods
  updateTitle() {
    console.log(this.updateTittleForm.value);
  }
  updatePrice() {
    console.log(this.updatePriceForm.value);
  }
  updateAddress() {
    console.log(this.updateAddressForm.value);
  }
  updateDetail() {
    console.log(this.updateDetailForm.value);
  }
  updateRule() {
    console.log(this.updateRuleForm.value);
  }
  updateActivity() {
    console.log(this.updateActivityForm.value);
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
