import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../service/vehicle.service';
import { UserDetails } from '../../vehicle.interface';
import { Timestamp } from '@angular/fire/firestore';
import { DownloadJourneyDetailsComponent } from '../download-journey-details/download-journey-details.component';
import { GenerateInvoiceComponent } from '../generate-invoice/generate-invoice.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-dashboard-upcoming-trips',
  standalone: true,
  imports: [RouterModule,CommonModule,DownloadJourneyDetailsComponent,GenerateInvoiceComponent,NgxPaginationModule],
  templateUrl: './dashboard-upcoming-trips.component.html',
  styleUrl: './dashboard-upcoming-trips.component.css'
})
export class DashboardUpcomingTripsComponent implements OnInit{

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
    this._vehicleService.getUpcomingTrips().subscribe({
      next: (trips) => {
        console.log(trips)
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
