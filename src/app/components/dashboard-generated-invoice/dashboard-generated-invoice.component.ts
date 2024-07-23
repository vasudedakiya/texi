import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../service/vehicle.service';
import { Timestamp } from '@angular/fire/firestore';
import { DownloadJourneyDetailsComponent } from '../download-journey-details/download-journey-details.component';
import { CommonModule } from '@angular/common';
import { GenerateInvoiceComponent } from '../generate-invoice/generate-invoice.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-generated-invoice',
  standalone: true,
  imports: [DownloadJourneyDetailsComponent,CommonModule,GenerateInvoiceComponent,RouterModule],
  templateUrl: './dashboard-generated-invoice.component.html',
  styleUrl: './dashboard-generated-invoice.component.css'
})
export class DashboardGeneratedInvoiceComponent implements OnInit {
  isLoading = false;
  isTripLoading = false;
  visibleTrip = false;
  trips: any[] = []

  constructor(private _vehicleService: VehicleService,
  ) { }

  ngOnInit(): void {
    this.fatchTrips()
  }

  fatchTrips() {
    this.isLoading = true;
    this._vehicleService.getAllDGInvoice().subscribe({
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

}
