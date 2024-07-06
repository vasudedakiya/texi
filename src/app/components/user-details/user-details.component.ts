import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationIqService } from '../../service/location-iq.service';
import { SharedDataService } from '../../service/shared-data.service';
import { switchMap, timer } from 'rxjs';
import { UserDetails } from '../../vehicle.interface';
import { VehicleService } from '../../service/vehicle.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
  providers: [MessageService]
})
export class UserDetailsComponent implements OnInit {
  fromText: string | undefined;
  toText: string | undefined;
  userName: string = '';
  mobileNo: string = '';
  email: string = '';
  fromLatLng: { lat: number, lon: number } | undefined;
  toLatLng: { lat: number, lon: number } | undefined;
  priceText: number | null = null;
  vehicleId: string = "";
  isCreateLoading: boolean = false;
  visible: boolean = false;

  userDetails: UserDetails = {
    Name: '',
    Email: '',
    MoNumber: '',
    From: '',
    To: '',
    Distances: 0,
    Vehicle: '',
    Rate: 0
  }

  constructor(private route: ActivatedRoute,
    private _locationIqService: LocationIqService,
    private _sharedDataService: SharedDataService,
    private _router: Router,
    private _vehicleService: VehicleService,
    private messageService: MessageService) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const fromLat = parseFloat(params['fromLat']);
      const fromLon = parseFloat(params['fromLon']);
      const toLat = parseFloat(params['toLat']);
      const toLon = parseFloat(params['toLon']);
      const cabTypId = this.vehicleId = params['cabTypId'];

      if (!isNaN(fromLat) && !isNaN(fromLon) && !isNaN(toLat) && !isNaN(toLon)) {
        this.fromLatLng = { lat: fromLat, lon: fromLon };
        this.toLatLng = { lat: toLat, lon: toLon };
        this.calculateDistance();
      }
      else if (this._sharedDataService.fromText != null || this._sharedDataService.toText != null) {
        this.fromText = this._sharedDataService.fromText;
        this.toText = this._sharedDataService.toText;
      }
      else {
        this._router.navigate(['/dashboard']);
      }
    });
  }

  calculateDistance(): void {

    if (this.fromLatLng && this.toLatLng) {
      if (this._sharedDataService.fromText == null) {
        this._locationIqService.reverseGeocoding(this.fromLatLng?.lat, this.fromLatLng?.lon).subscribe({
          next: (res) => {
            this.fromText = res.display_name;
          }
        })
      }
      else {
        this.fromText = this._sharedDataService.fromText;
      }

      timer(3000).pipe(
        switchMap(() => this._locationIqService.direction(this.fromLatLng?.lat!, this.fromLatLng?.lon!, this.toLatLng?.lat!, this.toLatLng?.lon!))
      ).subscribe({
        next: (res) => {

          this.userDetails.Distances = this.findMinimumDistance(res);

          if (this._sharedDataService.vehicle == null) {
            this._vehicleService.getVehicleById(this.vehicleId).subscribe(vehicle => {
              this._sharedDataService.vehicle = vehicle;
              this.priceText = (this.userDetails.Distances * vehicle.Price);
            })
          }
          else {
            this.priceText = (this.userDetails.Distances * this._sharedDataService.vehicle?.Price);
          }
        }
      })

      if (this._sharedDataService.toText == null) {
        timer(1000).pipe(
          switchMap(() => this._locationIqService.reverseGeocoding(this.toLatLng?.lat!, this.toLatLng?.lon!))
        ).subscribe({
          next: (res) => {
            this.toText = res.display_name;
          }
        })
      }
      else {
        this.toText = this._sharedDataService.toText
      }
    }
    else {
      console.error('fromLatLng or toLatLng is undefined');
    }
  }

  findDistance() {
    timer(100).pipe(
      switchMap(() => this._locationIqService.direction(this.fromLatLng?.lat!, this.fromLatLng?.lon!, this.toLatLng?.lat!, this.toLatLng?.lon!))
    ).subscribe({
      next: (res) => {
        this.userDetails.Distances = this.findMinimumDistance(res);
      }
    })
  }

  findMinimumDistance(response: any): number {
    const distances: number[] = [];

    function extractDistances(obj: any) {
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          if (key === 'distance' && typeof obj[key] === 'number') {
            distances.push(obj[key]);
          } else {
            extractDistances(obj[key]);
          }
        }
      }
    }

    // Start extraction from the response object
    extractDistances(response);

    // Filter out zero distances and find the minimum distance
    const validDistances = distances.filter(distance => distance > 0);
    const minDistance = Math.min(...validDistances);

    return minDistance / 1000;
  }

  onSubmit() {
    this.isCreateLoading = true;

    this.userDetails = {
      Name: this.userName,
      Email: this.email,
      MoNumber: this.mobileNo,
      From: this.fromText?.toString(),
      To: this.toText?.toString(),
      Distances: this.userDetails.Distances,
      Vehicle: this._sharedDataService.vehicle?.VehicleName,
      Rate: Number(this.priceText)
    }

    this._vehicleService.addUserDetails(this.userDetails).subscribe({
      next: (data) => {
        this.isCreateLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record Added' });
        this.visible = false;
        document.location.href = `https://wa.me/${this._sharedDataService.PhoneNo}?text=vasu`;
      },
      error: (err) => {
        this.isCreateLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
      }
    });
  }
}
