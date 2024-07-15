import { Component } from '@angular/core';
import { DashboardSidebarComponent } from '../dashboard-sidebar/dashboard-sidebar.component';

@Component({
  selector: 'app-dashboard-cabs',
  standalone: true,
  imports: [DashboardSidebarComponent],
  templateUrl: './dashboard-cabs.component.html',
  styleUrl: './dashboard-cabs.component.css'
})
export class DashboardCabsComponent {

}
