import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../service/vehicle.service';
import { UserDetails } from '../../vehicle.interface';
import { CommonModule } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard-trips',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './dashboard-trips.component.html',
  styleUrl: './dashboard-trips.component.css'
})
export class DashboardTripsComponent implements OnInit {
  isLoading = false;
  trips: UserDetails[] = []

  constructor(private _vehicleService: VehicleService) { }

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
}
