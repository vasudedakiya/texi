import { Component, HostListener, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../service/vehicle.service';
import { UserDetails } from '../../vehicle.interface';
import { CommonModule } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
import { ConfirmationService, MessageService } from 'primeng/api';

import { DownloadJourneyDetailsComponent } from '../download-journey-details/download-journey-details.component';
import { GenerateInvoiceComponent } from '../generate-invoice/generate-invoice.component';

@Component({
  selector: 'app-dashboard-trips',
  standalone: true,
  imports: [DownloadJourneyDetailsComponent, CommonModule, GenerateInvoiceComponent, RouterModule],
  templateUrl: './dashboard-trips.component.html',
  styleUrl: './dashboard-trips.component.css',
  providers: [ConfirmationService, MessageService]
})
export class DashboardTripsComponent implements OnInit {
  isLoading = false;
  isTripLoading = false;
  visibleTrip = false;
  trips: any[] = [];
  isSidebarVisible: boolean = false;

  constructor(private _vehicleService: VehicleService,
  ) { }

  ngOnInit(): void {
    this.fatchTrips();
    this.checkWindowSize();
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
