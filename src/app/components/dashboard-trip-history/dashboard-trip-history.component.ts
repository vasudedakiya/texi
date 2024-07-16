import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../service/vehicle.service';
import { Timestamp } from '@angular/fire/firestore';
import { UserDetails } from '../../vehicle.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-trip-history',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './dashboard-trip-history.component.html',
  styleUrl: './dashboard-trip-history.component.css'
})
export class DashboardTripHistoryComponent implements OnInit {
  isLoading = false;
  trips: UserDetails[] = []

  constructor(private _vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.fatchTrips()
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
}
