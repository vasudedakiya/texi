import { Component, HostListener, OnInit } from '@angular/core';
import { VehicleService } from '../../service/vehicle.service';
import { Timestamp } from '@angular/fire/firestore';
import { DownloadJourneyDetailsComponent } from '../download-journey-details/download-journey-details.component';
import { CommonModule } from '@angular/common';
import { GenerateInvoiceComponent } from '../generate-invoice/generate-invoice.component';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-dashboard-generated-invoice',
  standalone: true,
  imports: [DownloadJourneyDetailsComponent,CommonModule,GenerateInvoiceComponent,RouterModule,NgxPaginationModule],
  templateUrl: './dashboard-generated-invoice.component.html',
  styleUrl: './dashboard-generated-invoice.component.css'
})
export class DashboardGeneratedInvoiceComponent implements OnInit {
  isLoading = false;
  isTripLoading = false;
  visibleTrip = false;
  trips: any[] = [];
  isSidebarVisible: boolean = false;
  p: number = 1;

  constructor(private _vehicleService: VehicleService,
  ) { }

  ngOnInit(): void {
    this.fatchTrips();
    this.checkWindowSize();
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
