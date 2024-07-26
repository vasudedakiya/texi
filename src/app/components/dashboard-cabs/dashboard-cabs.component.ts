import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Vehicles } from '../../vehicle.interface';
import { VehicleService } from '../../service/vehicle.service';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { RouterModule } from '@angular/router';
import { GenerateInvoiceComponent } from '../generate-invoice/generate-invoice.component';

@Component({
  selector: 'app-dashboard-cabs',
  standalone: true,
  imports: [InputTextModule,
    ReactiveFormsModule,
    TableModule, TagModule, RatingModule, ButtonModule, CommonModule, ProgressSpinnerModule, DialogModule,
    ConfirmDialogModule, FileUploadModule,
    ToastModule, RouterModule,GenerateInvoiceComponent],
  templateUrl: './dashboard-cabs.component.html',
  styleUrl: './dashboard-cabs.component.css',
  providers: [ConfirmationService, MessageService]
})
export class DashboardCabsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  vehicleInformation: FormGroup = new FormGroup({
    ImageUrl: new FormControl(null, [Validators.required]),
    VehicleName: new FormControl(null, [Validators.required]),
    Desc: new FormControl(null, [Validators.required]),
    Price: new FormControl(null, [Validators.required]),
    Passengers: new FormControl(null, [Validators.required]),
    AirCondition: new FormControl(null, [Validators.required]),
    Luggage: new FormControl(null, [Validators.required]),
  })

  visible: boolean = false;
  isLoading = false;
  isCreateLoading = false;
  logoBase64string: string = ''
  vehicals: Vehicles[] = [];
  file!: File;
  editMode: boolean = false;
  currentVehicleId: string = "";
  oldImage: string = "";
  isSidebarVisible: boolean = false;

  constructor(private _vehicleService: VehicleService,
    private _storage: Storage,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService
  ) { }

  ngOnInit() {
    // this.vehicals = this.commonService.customCarouselCards;
    this.fetchVehicals()
    this.updateImageUrlValidator();
    this.checkWindowSize();
  }

  fetchVehicals() {
    this.isLoading = true;
    this._vehicleService.getVehicles().subscribe({
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
    this.oldImage = "";
  }

  closeVehicleModal() {
    this.visible = false
    this.logoBase64string = "";
    this.vehicleInformation.reset();
    this.editMode = false;
    this.oldImage = "";
    this.updateImageUrlValidator();
  }

  private updateVehicleImages() {
    this.vehicals.forEach(vehicle => {
      const imageRef = ref(this._storage, vehicle.ImageUrl);
      getDownloadURL(imageRef).then((url: string) => {
        vehicle.ImageUrl = url;
      }).catch((error: any) => {
        console.error(`Failed to get image URL for vehicle ${vehicle.id}:`, error);
        vehicle.ImageUrl = 'path/to/default-image.png';
      });
    });
    this.isLoading = false;
  }

  async onSubmit() {
    this.isCreateLoading = true;
    let imageUrl = "";
    if (this.editMode && this.vehicleInformation.value.ImageUrl == null) {
      imageUrl = this.oldImage
    }
    else {
      if (this.file) {
        imageUrl =  `Vehicles/${this.file.name}`
        const storageRef = ref(this._storage, imageUrl);
        try {
          await uploadBytes(storageRef, this.file);
        } catch (error) {
          this.isCreateLoading = false;
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error uploading image' });
          return; // Exit early if image upload fails
        }
      }
    }

    const dataToAdd = { ...this.vehicleInformation.value, ImageUrl: imageUrl };

    if (this.editMode) {
      this._vehicleService.updateVehicle(this.currentVehicleId, dataToAdd).subscribe({
        next: (data) => {
          this.isCreateLoading = false;
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Vehicle Updated' });
          this.vehicleInformation.reset();
          this.cancleVehileLogo();
          this.visible = false;
          this.editMode = false; // Reset the flag
        },
        error: (err) => {
          this.isCreateLoading = false;
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating vehicle' });
        }
      });
    } else {
      this._vehicleService.addVechicles(dataToAdd).subscribe({
        next: (data) => {
          this.isCreateLoading = false;
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Vehicle Added' });
          this.vehicleInformation.reset();
          this.cancleVehileLogo();
          this.visible = false;
        },
        error: (err) => {
          this.isCreateLoading = false;
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding vehicle' });
        }
      });
    }
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
    this._confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this._vehicleService.removeVehicle(Id).subscribe({
          next: (data) => {
            this._messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
          },
          error: (err) => {
            this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
          }
        })
      },
      reject: () => {
        this._messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }

  signOut() {
    this._vehicleService.signOut();
  }

  editVehicle(vehicle: Vehicles) {
    this.currentVehicleId = vehicle.id; // Store the current vehicle ID
    this.editMode = true; // Set edit mode to true
    this.vehicleInformation.patchValue({
      // ImageUrl: vehicle.ImageUrl,
      VehicleName: vehicle.VehicleName,
      Desc: vehicle.Desc,
      Price: vehicle.Price,
      Passengers: vehicle.Passengers,
      AirCondition: vehicle.AirCondition,
      Luggage: vehicle.Luggage
    });
    this.oldImage = vehicle.ImageUrl;
    this.logoBase64string = vehicle.ImageUrl;
    this.visible = true; // Open the dialog
    this.updateImageUrlValidator();
  }

  private updateImageUrlValidator() {
    const imageUrlControl = this.vehicleInformation.get('ImageUrl');
    if (this.editMode) {
      imageUrlControl?.clearValidators();
    } else {
      imageUrlControl?.setValidators([Validators.required]);
    }
    imageUrlControl?.updateValueAndValidity();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
      this.checkWindowSize();
  }

  checkWindowSize() {
      const windowWidth = window.innerWidth;
      this.isSidebarVisible = windowWidth > 1199;
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
