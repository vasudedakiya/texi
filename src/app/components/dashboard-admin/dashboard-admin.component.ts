import { Component, OnInit } from '@angular/core';
import { AdminModel, UserDetails } from '../../vehicle.interface';
import { VehicleService } from '../../service/vehicle.service';
import { Timestamp } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {
  isLoading = false;
  admins: AdminModel[] = []

  constructor(private _vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.fatchAdmins()
  }

  fatchAdmins() {
    this.isLoading = true;
    this._vehicleService.getAdmins().subscribe({
      next: (admins) => {
        this.admins = admins;
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
