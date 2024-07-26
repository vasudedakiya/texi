import { Component, HostListener, OnInit } from '@angular/core';
import { AdminModel } from '../../vehicle.interface'; // Assuming AdminModel exists
import { VehicleService } from '../../service/vehicle.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../../service/shared-data.service';
import { GenerateInvoiceComponent } from '../generate-invoice/generate-invoice.component';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,GenerateInvoiceComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  isLoading = false;
  admins: AdminModel[] = [];
  passwordVisibility: { [key: string]: boolean } = {};
  isEditing = false;
  mobileNumberObj = { PhoneNo: '', id: '' }; 
  isSidebarVisible: boolean = false;

  constructor(private _vehicleService: VehicleService, private _sharedDataService: SharedDataService) { }

  ngOnInit(): void {
    this.fetchAdmins();
    this._vehicleService.getPhoneNumber().subscribe((res: any) => {
      this.mobileNumberObj = res[0];
    })
    this.checkWindowSize();
  }

  fetchAdmins(): void {
    this.isLoading = true;
    this._vehicleService.getAdmins().subscribe({
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
    this._vehicleService.signOut();
  }

  togglePasswordVisibility(adminId: string): void {
    this.passwordVisibility[adminId] = !this.passwordVisibility[adminId];
  }

  editMobileNumber() {
    this.isEditing = true;
  }

  saveMobileNumber() {
    if (!this.mobileNumberObj.PhoneNo.match(/^\d+$/)) {
      alert('Please enter a valid phone number.');
      return;
    }
    this.isEditing = false;

    if (this._sharedDataService.PhoneNo != this.mobileNumberObj.PhoneNo) {
      debugger;
      this._vehicleService.updatePhoneNumber(this.mobileNumberObj.PhoneNo, this.mobileNumberObj.id).subscribe();
    }
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
