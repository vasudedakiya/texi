import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../service/vehicle.service';
import { Timestamp } from '@angular/fire/firestore';
import { UserDetails } from '../../vehicle.interface';
import { CommonModule } from '@angular/common';
import { DownloadJourneyDetailsComponent } from '../download-journey-details/download-journey-details.component';
import { GenerateInvoiceComponent } from '../generate-invoice/generate-invoice.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-dashboard-trip-history',
  standalone: true,
  imports: [RouterModule,CommonModule,DownloadJourneyDetailsComponent,GenerateInvoiceComponent,NgxPaginationModule],
  templateUrl: './dashboard-trip-history.component.html',
  styleUrl: './dashboard-trip-history.component.css'
})
export class DashboardTripHistoryComponent implements OnInit {
  isLoading = false;
  trips: any[] = [];
  isSidebarVisible: boolean = false;
  p: number = 1;

  constructor(private _vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.fatchTrips();
    this.checkWindowSize();
  }

  fatchTrips() {
    this.isLoading = true;
    this._vehicleService.getTripHistory().subscribe({
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
