import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../service/vehicle.service';
import { UserDetails } from '../../vehicle.interface';
import { CommonModule } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SharedDataService } from '../../service/shared-data.service';
import { CalendarModule } from 'primeng/calendar';
import { DownloadJourneyDetailsComponent } from '../download-journey-details/download-journey-details.component';
import { GenerateInvoiceComponent } from '../generate-invoice/generate-invoice.component';

@Component({
  selector: 'app-dashboard-trips',
  standalone: true,
  imports:[DownloadJourneyDetailsComponent,CommonModule,GenerateInvoiceComponent,RouterModule],
  // imports: [InputTextModule,
  //   ReactiveFormsModule,
  //   TableModule, TagModule, RatingModule, ButtonModule, CommonModule, ProgressSpinnerModule, DialogModule,
  //   ConfirmDialogModule, FileUploadModule,
  //   ToastModule, RouterModule,CalendarModule,DownloadJourneyDetailsComponent],
  templateUrl: './dashboard-trips.component.html',
  styleUrl: './dashboard-trips.component.css',
  providers: [ConfirmationService, MessageService]
})
export class DashboardTripsComponent implements OnInit {
  isLoading = false;
  isTripLoading = false;
  visibleTrip = false;
  trips: UserDetails[] = []
  // tripInformation: FormGroup = new FormGroup({
  //   Name: new FormControl('', Validators.required),
  //   Email: new FormControl('', [Validators.required, Validators.email]),
  //   MoNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
  //   From: new FormControl('', Validators.required),
  //   To: new FormControl('', Validators.required),
  //   Vehicle: new FormControl('', Validators.required),
  //   Rate: new FormControl('', Validators.required),
  //   Date: new FormControl(null, Validators.required)
  // });

  constructor(private _vehicleService: VehicleService,
  ) { }

  ngOnInit(): void {
    this.fatchTrips()
  }

  fatchTrips() {
    this.isLoading = true;
    this._vehicleService.getAllTrips().subscribe({
      next: (trips) => {
        this.trips = trips.map(trip => ({
          ...trip,
          Date: (trip.Date instanceof Timestamp) ? trip.Date.toDate() : trip.Date
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  signOut() {
    this._vehicleService.signOut();
  }

  // async onSubmitTrip(){
  //   console.log
  //   this._vehicleService.addUserDetails(this.tripInformation.value).subscribe({
  //     next: (data) => {
  //       this.isTripLoading = false;
  //       this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Record Added' });
  //       this.visibleTrip = false;
  //     },
  //     error: (err) => {
  //       this.isTripLoading = false;
  //       this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
  //     }
  //   });
  // }

  // closeTripModal() {
  //   this.visibleTrip = false;
  //   this.tripInformation.reset();
  // }
}
