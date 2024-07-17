import { Component, OnInit } from '@angular/core';
import { AdminModel } from '../../vehicle.interface'; // Assuming AdminModel exists
import { VehicleService } from '../../service/vehicle.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports:[CommonModule,RouterModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  isLoading = false;
  admins: AdminModel[] = [];
  passwordVisibility: { [key: string]: boolean } = {}; // Object to track password visibility

  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.fetchAdmins();
  }

  fetchAdmins(): void {
    this.isLoading = true;
    this.vehicleService.getAdmins().subscribe({
      next: (admins: AdminModel[]) => {
        this.admins = admins;
        this.isLoading = false;
        // Initialize password visibility for each admin
        this.admins.forEach(admin => this.passwordVisibility[admin.UserId] = false);
      },
      error: (error) => {
        console.error('Error fetching admins:', error);
        this.isLoading = false;
      }
    });
  }

  signOut(): void {
    this.vehicleService.signOut();
  }

  togglePasswordVisibility(adminId: string): void {
    this.passwordVisibility[adminId] = !this.passwordVisibility[adminId];
  }
}
