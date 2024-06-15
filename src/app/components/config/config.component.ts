import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { VehicleService } from '../../service/vehicle.service';
import { Storage, getDownloadURL, ref, uploadBytes, uploadBytesResumable } from '@angular/fire/storage';
import { Vehicles } from '../../vehicle.interface';
import { CommonService } from '../../service/common.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';


@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    TableModule, TagModule, RatingModule, ButtonModule, CommonModule, ProgressSpinnerModule, DialogModule,
    ConfirmDialogModule, FileUploadModule,
    ToastModule
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ConfigComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  vehicleInformation: FormGroup = new FormGroup({
    ImageUrl: new FormControl(null, [Validators.required]),
    VehicleName: new FormControl(null, [Validators.required]),
    Desc: new FormControl(null, [Validators.required]),
    Price: new FormControl(null, [Validators.required]),
  })

  visible: boolean = false;
  isLoading = false;
  isCreateLoading = false;
  logoBase64string: string = ''
  vehicals: Vehicles[] = [];
  file!: File;

  constructor(private vehicleService: VehicleService,
    private commonService: CommonService,
    private _storage: Storage,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // this.vehicals = this.commonService.customCarouselCards;
    this.fetchVehicals()
  }

  fetchVehicals() {
    this.isLoading = true;
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicals = vehicles;
        this.updateVehicleImages();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false }
    })
  }

  cancleVehileLogo() {
    this.logoBase64string = "";
    this.vehicleInformation.get('ImageUrl')?.setValue('');
  }

  private updateVehicleImages() {
    this.vehicals.forEach(vehicle => {
      const imageRef = ref(this._storage, vehicle.ImageUrl);
      getDownloadURL(imageRef).then((url: string) => {
        console.log(url);
        vehicle.ImageUrl = url;
      }).catch((error: any) => {
        console.error(`Failed to get image URL for vehicle ${vehicle.Id}:`, error);
        vehicle.ImageUrl = 'path/to/default-image.png';
      });
    });
    this.isLoading = false;
  }

  async onSubmit() {
    this.isCreateLoading = true;
    const storageRef = ref(this._storage, `Vehicles/${this.file.name}`);
    try {
      await uploadBytes(storageRef, this.file);
    }
    catch (error) { }
    const dataToAdd = { ...this.vehicleInformation.value, ImageUrl: `Vehicles/${this.file.name}` }
    this.vehicleService.addVechicles(dataToAdd).subscribe({
      next: (data) => {
        this.isCreateLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record Added' });
        this.vehicleInformation.reset();
        this.cancleVehileLogo()
        this.visible = false;
      },
      error: (err) => {
        this.isCreateLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
      }
    });
  }

  handleFileInput(event: Event) {
    const that = this;
    let ev: any = event.target as HTMLInputElement || null;
    this.file = ev.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = function () {
      if (typeof reader.result == 'string')
        that.logoBase64string = reader.result;
    };
    reader.onerror = function (error) {
      that.logoBase64string = ""
    };
  }

  deleteVehicle(Id: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.vehicleService.removeVehicle(Id).subscribe({
          next: (data) => {
            console.log(data)
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
          },
          error: (err) => {
            console.log(err)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }

}