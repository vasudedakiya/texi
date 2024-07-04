import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationIqService } from '../../service/location-iq.service';
import { SharedDataService } from '../../service/shared-data.service';
import { switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  fromText: string | undefined;
  toText: string | undefined;
  userName: string = '';
  mobileNo: string = '';
  email: string = '';
  fromLatLng: { lat: number, lon: number } | undefined;
  toLatLng: { lat: number, lon: number } | undefined;

  constructor(private route: ActivatedRoute, private _locationIqService: LocationIqService, private _sharedDataService: SharedDataService,private _router: Router) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const fromLat = parseFloat(params['fromLat']);
      const fromLon = parseFloat(params['fromLon']);
      const toLat = parseFloat(params['toLat']);
      const toLon = parseFloat(params['toLon']);
      const cabTypId = params['cabTypId'];

      if (!isNaN(fromLat) && !isNaN(fromLon) && !isNaN(toLat) && !isNaN(toLon)) {
        this.fromLatLng = { lat: fromLat, lon: fromLon };
        this.toLatLng = { lat: toLat, lon: toLon };
        this.calculateDistance();
      }
      else if (this._sharedDataService.fromText != null || this._sharedDataService.toText != null) {
        this.fromText = this._sharedDataService.fromText;
        this.toText = this._sharedDataService.toText
      }
      else{
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
      else{
        this.fromText = this._sharedDataService.fromText;
      }

      // timer(2000).pipe(
      //   switchMap(() => this._locationIqService.direction(this.fromLatLng?.lat!, this.fromLatLng?.lon!, this.toLatLng?.lat!, this.toLatLng?.lon!))
      // ).subscribe({
      //   next: (res) => {
      //     this.distance = (res.routes[0].distance) / 1000;
      //   }
      // })

      if (this._sharedDataService.toText == null) {
        timer(1000).pipe(
          switchMap(() => this._locationIqService.reverseGeocoding(this.toLatLng?.lat!, this.toLatLng?.lon!))
        ).subscribe({
          next: (res) => {
            this.toText = res.display_name;
          }
        })
      }
      else{
        this.toText = this._sharedDataService.toText
      }
    }
    else {
      console.error('fromLatLng or toLatLng is undefined');
    }
  }

  onSubmit() {
    // Handle form submission logic here
    console.log('Form submitted:', {
      userName: this.userName,
      mobileNo: this.mobileNo,
      email: this.email
    });
  }
}
