import { StaticFunc } from './../../function-usages/static.func';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { Subscription } from 'rxjs/Subscription';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-shelter-insert',
  templateUrl: './shelter-insert.component.html',
  styleUrls: ['./shelter-insert.component.css']
})
export class ShelterInsertComponent implements OnInit {
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
  uploadPercentShelter: Array<any>;
  uploadPercentRoom: Array<any>;
  imageLengthUpload: number;
  imageIndexUpload: number;
  imageUploadMessage: string;
  private subscriptionShelters: Array<Subscription>;
  private subscriptionRooms: Array<Subscription>;

  // Form
  shelterForm: FormGroup;
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
    formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage,
    private firebaseStorageShelter: AngularFireStorage,
    private firebaseStorageRoom: AngularFireStorage
  ) {
    // Create shelter form
    this.shelterForm = formBuilder.group({
      shelt_name: [null, [Validators.required]],
      shelt_type: [null, [Validators.required]],
      shelt_province: [null, [Validators.required]],
      shelt_district: [null, [Validators.required]],
      shelt_village: [null, [Validators.required]],
      shelt_lat: [null, [Validators.required]],
      shelt_long: [null, [Validators.required]],
      shelt_detail: [null],
      shelt_email: [null],
      shelt_tel: [null, [Validators.required]],
      socials: formBuilder.array([this.initSocial()]),
      images: formBuilder.array([]),
      shelt_video: [null],
      rooms: formBuilder.array([this.initRoom()])
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

    this.subscriptionShelters = [];
    this.subscriptionRooms = [];
    this.uploadPercentShelter = [];
    this.uploadPercentRoom = [];
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
      name: new FormControl(null, [Validators.required]),
      url: new FormControl(null, [Validators.required])
    });
  }

  initRoom() {
    return new FormGroup({
      style: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      room_image: new FormControl(null, [Validators.required])
    });
  }

  removeSocial(index) {
    (<FormArray>this.shelterForm.get('socials')).removeAt(index);
  }
  addNewSocial() {
    (<FormArray>this.shelterForm.get('socials')).push(this.initSocial());
  }
  socialLength() {
    return (<FormArray>this.shelterForm.get('socials')).length;
  }

  removeRoomStyle(index) {
    (<FormArray>this.shelterForm.get('rooms')).removeAt(index);
  }
  addNewRoomStyle() {
    (<FormArray>this.shelterForm.get('rooms')).push(this.initRoom());
  }
  getRoomControls() {
    return (<FormArray> this.shelterForm.get('rooms')).controls;
  }
  roomsLength() {
    return (<FormArray>this.shelterForm.get('rooms')).length;
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
      this.shelterForm.value['images'].push(newImage);
    } else if ( this.roomIndex >= 0 ) {
      (<FormGroup>(<FormArray> this.shelterForm.get('rooms')).controls[this.roomIndex]).get('room_image').setValue(newImage);
    }
    this.data = {};
    this.cropImageChecked = false;
    this.roomIndex = null;
  }

  saveShelter() {
    this.imageLengthUpload = this.shelterForm.value['images'].length;
    this.imageIndexUpload = 0;
    let imageUploadedCheck = 0;
    this.uploadPercentShelter = [];
    this.uploadPercentRoom = [];
    this.imageUploadMessage = 'ກະລຸນາລໍຖ້າ...';
    this.uploadImageChecked = true;
    const rooms = this.shelterForm.value['rooms'].slice(0, this.shelterForm.value['rooms'].length);
    if (this.imageLengthUpload > 0) { // ຖ້າມີຮູບທີ່ຈະອັບໂຫຼດ

      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].room_image !== null) {
          this.imageLengthUpload += 1;
        }
      }

      const shelterRef = this.firebaseStorage.ref('Shelters'); // ກຳນົດ Path ທີ່ຢູ່ຂອງຮູບໃນ Firebase Storage
      const uploadingImages = new Promise((resolve, reject) => { // ສ້າງໂພຼມິດທີ່ໃຊ້ກວດສອບວ່າອັບໂຫລດຮູບໝົດຫຼືຍັງ
        const imageUrls: Array<string> = [];

        for (let i = 0; i < this.shelterForm.value['images'].length; i++) {
          this.uploadPercentShelter[i] = 0;
          /*const test = setInterval(() => {
            this.uploadPercentRestaurant[i] += 10;
            if (this.uploadPercentRestaurant[i] === 100) {
              clearInterval(test);
              resolve(foods);
            }
          }, 2000);*/
          const image = this.shelterForm.value['images'][i]; // ເອົາຮູບຈາກຟອມມາເກັບໄວ້
          const imageObject = image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
          const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
          const shelterUpload = shelterRef.child(imageName).putString(image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Firebase Storage
          this.subscriptionShelters[i] = shelterUpload.percentageChanges().subscribe((percent) => {
            this.uploadPercentShelter[i] = percent;                                           // ເອົາເປີເຊັນການອັບໂຫຼດຂອງແຕ່ລະຮູບ
            console.log(percent);
            if ( percent === 100) {                                                   // ເມື່ອໃດອັບໂຫລດສຳເລັດ ຮ້ອງຂໍ URL
              this.imageIndexUpload += 1;
              this.subscriptionShelters[i].unsubscribe();                                    // ຄືນການ subscribe
              setTimeout(() => {
                const imageUrl: AngularFireStorageReference = this.firebaseStorageShelter.ref('Shelters/' + imageName);
                this.subscriptionShelters[i] = imageUrl.getDownloadURL().subscribe((url) => {
                  imageUrls[i] = url;                            // ເກັບ URL ຄືນໄວ້ໃນຟອມ
                  imageUploadedCheck += 1;
                  console.log('s', i, this.imageIndexUpload);
                  if (imageUploadedCheck === this.imageLengthUpload) {              // ອັບໂຫຼດໝົດເມື່ອໃດ ອອກຈາກໂພຼມິດສ໌ນີ້ທັງທີ່
                    resolve({restaurantImages: imageUrls, newRooms: rooms});
                  }
                  this.subscriptionShelters[i].unsubscribe();
                }, (error) => {
                  this.subscriptionShelters[i].unsubscribe();
                  reject(error);
                });
              }, 3000);
            }
          });
        }

        for (let i = 0; i < rooms.length; i++) {
          this.uploadPercentRoom[i] = 0;
          if (rooms[i].room_image !== null) {
            /*const test = setInterval(() => {
              this.uploadPercentFood[i] += 10;
              if (this.uploadPercentFood[i] === 100) {
                clearInterval(test);
                resolve(foods);
              }
            }, 2000);*/
            const image = rooms[i].room_image; // ເອົາຮູບຈາກຟອມມາເກັບໄວ້
            const imageObject = image.split(',')[0].split('/')[1].split(';')[0]; // ຕັດເອົານາດສະກຸນອອກຈາກຮູບທີ່ເປັນ Base 64
            const imageName = StaticFunc.ramdomText() + Date.now().toString() + '.' + imageObject; // ກຳນົດຊີ່ຮູບໃຫມ່
            const roomUpload = shelterRef.child('Rooms').child(imageName).putString(image, 'data_url'); // ອັບໂຫຼດຂຶ້ນ Storage
            this.subscriptionRooms[i] = roomUpload.percentageChanges().subscribe((percent) => {
              this.uploadPercentRoom[i] = percent;
              if ( percent === 100) {                                                   // ເມື່ອໃດອັບໂຫລດສຳເລັດ ຮ້ອງຂໍ URL
                this.imageIndexUpload += 1;
                this.subscriptionRooms[i].unsubscribe();                                    // ຄືນການ subscribe
                setTimeout(() => {
                  const imageUrl: AngularFireStorageReference = this.firebaseStorageRoom.ref('Shelters/Rooms/' + imageName);
                  this.subscriptionRooms[i] = imageUrl.getDownloadURL().subscribe((url) => {
                    rooms[i].room_image = url;                            // ເກັບ URL ຄືນໄວ້ໃນຟອມ
                    imageUploadedCheck += 1;
                    console.log('r', i, this.imageIndexUpload);
                    if (imageUploadedCheck === this.imageLengthUpload) {              // ອັບໂຫຼດໝົດເມື່ອໃດ ອອກຈາກໂພຼມິດສ໌ນີ້ທັງທີ່
                      resolve({restaurantImages: imageUrls, newRooms: rooms});
                    }
                    this.subscriptionRooms[i].unsubscribe();
                  }, (error) => {
                    this.subscriptionRooms[i].unsubscribe();
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
            for (let i = 1; i < this.socialLength(); i++) {
              this.removeSocial(i);
            }
            for (let i = 1; i < this.roomsLength(); i++) {
              this.removeRoomStyle(i);
            }
            this.shelterForm.reset();
          }, 3000);
        }, 5000);
      }).catch((error) => {
        console.log(error);
      });
    }
  }

}
