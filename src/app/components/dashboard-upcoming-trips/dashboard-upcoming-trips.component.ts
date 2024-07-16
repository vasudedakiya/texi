import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../service/vehicle.service';
import { UserDetails } from '../../vehicle.interface';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard-upcoming-trips',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './dashboard-upcoming-trips.component.html',
  styleUrl: './dashboard-upcoming-trips.component.css'
})
export class DashboardUpcomingTripsComponent implements OnInit{

  isLoading = false;
  trips: UserDetails[] = []

  constructor(private _vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.fatchTrips()
  }

  fatchTrips() {
    this.isLoading = true;
    this._vehicleService.getUpcomingTrips().subscribe({
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
