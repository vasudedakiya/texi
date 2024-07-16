import { Component, OnInit } from '@angular/core';
import { UserDetails } from '../../vehicle.interface';
import { VehicleService } from '../../service/vehicle.service';
import { Timestamp } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-customers',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './dashboard-customers.component.html',
  styleUrl: './dashboard-customers.component.css'
})
export class DashboardCustomersComponent implements OnInit {
  isLoading = false;
  users: UserDetails[] = []

  constructor(private _vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.fatchTrips()
  }

  fatchTrips() {
    this.isLoading = true;
    this._vehicleService.getCustomers().subscribe({
      next: (users) => {
        console.log(users)
        this.users = users.map(users => ({
          ...users,
          Date: (users.Date instanceof Timestamp) ? users.Date.toDate() : users.Date
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

}
