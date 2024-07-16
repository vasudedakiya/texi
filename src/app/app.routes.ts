import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ConfigComponent } from './components/config/config.component';
import { BookingDetailsComponent } from './components/booking-details/booking-details.component';
import { DashboardCabsComponent } from './components/dashboard-cabs/dashboard-cabs.component';
import { DashboardTripsComponent } from './components/dashboard-trips/dashboard-trips.component';
import { DashboardUpcomingTripsComponent } from './components/dashboard-upcoming-trips/dashboard-upcoming-trips.component';
import { DashboardTripHistoryComponent } from './components/dashboard-trip-history/dashboard-trip-history.component';
import { DashboardCustomersComponent } from './components/dashboard-customers/dashboard-customers.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'about-us', component: AboutUsComponent },
    { path: 'contact-us', component: ContactUsComponent },
    { path: 'config', component: ConfigComponent },
    { path: 'booking-details', component: BookingDetailsComponent },
    { path: 'config/cabs', component: DashboardCabsComponent },
    { path: 'config/trips', component: DashboardTripsComponent },
    { path: 'config/upcoming-trips', component: DashboardUpcomingTripsComponent },
    { path: 'config/trip-history', component: DashboardTripHistoryComponent },
    { path: 'config/customers', component: DashboardCustomersComponent },
    { path: 'config/admin', component: DashboardAdminComponent },
];
