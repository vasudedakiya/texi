import { Component, HostListener, OnInit } from '@angular/core';
import { UserDetails } from '../../vehicle.interface';
import { VehicleService } from '../../service/vehicle.service';
import { Timestamp } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GenerateInvoiceComponent } from '../generate-invoice/generate-invoice.component';

@Component({
  selector: 'app-dashboard-customers',
  standalone: true,
  imports: [RouterModule,CommonModule,GenerateInvoiceComponent],
  templateUrl: './dashboard-customers.component.html',
  styleUrl: './dashboard-customers.component.css'
})
export class DashboardCustomersComponent implements OnInit {
  isLoading = false;
  users: UserDetails[] = []
  isSidebarVisible: boolean = false;

  constructor(private _vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.fatchTrips()
    this.checkWindowSize();
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
