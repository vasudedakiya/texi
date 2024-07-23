import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { DownloadJourneyDetailsComponent } from '../download-journey-details/download-journey-details.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VehicleService } from '../../service/vehicle.service';

@Component({
  selector: 'app-generate-invoice',
  standalone: true,
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    RatingModule,
    ButtonModule,
    CommonModule,
    ProgressSpinnerModule,
    DialogModule,
    ConfirmDialogModule,
    FileUploadModule,
    ToastModule,
    CalendarModule,
    DownloadJourneyDetailsComponent
  ],
  templateUrl: './generate-invoice.component.html',
  styleUrl: './generate-invoice.component.css',
  providers: []
})
export class GenerateInvoiceComponent {
  @ViewChild('downloadJourneyDetails') downloadJourneyDetailsComponent!: DownloadJourneyDetailsComponent;
  isTripLoading = false;
  visibleTrip = false;
  tripInformation: FormGroup = new FormGroup({
    Name: new FormControl('', Validators.required),
    Email: new FormControl('', [Validators.required, Validators.email]),
    MoNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    From: new FormControl('', Validators.required),
    To: new FormControl('', Validators.required),
    Vehicle: new FormControl('', Validators.required),
    Rate: new FormControl('', Validators.required),
    Date: new FormControl(null, Validators.required)
  });

  constructor(private _vehicleService: VehicleService) { }

  async onSubmitTrip() {
    debugger;
    let billNo = 0;

    this._vehicleService.getHighestDGBillNo().subscribe({
      next: (highestBillNo) => {
        billNo = highestBillNo + 1;
        if (this.downloadJourneyDetailsComponent) {
          // Set the download data
          this.downloadJourneyDetailsComponent.downloadData = this.tripInformation.value;

          this.downloadJourneyDetailsComponent.downloadData.Rate = this.tripInformation.value.Rate + (this.tripInformation.value.Rate * 0.07);
          this.downloadJourneyDetailsComponent.downloadData.BillNo = billNo;
          this._vehicleService.addDGInvoice(this.downloadJourneyDetailsComponent.downloadData).subscribe({
            next: (res) => {
              setTimeout(() => {
                this.downloadJourneyDetailsComponent.onDownload();
                this.visibleTrip = false;
              });
            }
          })


        } else {
          console.error('DownloadJourneyDetailsComponent is not initialized');
        }
      },
    });

    // Ensure the download component is initialized

  }

  closeTripModal() {
    this.visibleTrip = false;
    this.tripInformation.reset();
  }
}
