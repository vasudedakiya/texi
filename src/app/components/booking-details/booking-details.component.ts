import { Component, OnInit } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { ActivatedRoute } from '@angular/router';
import { LocationIqService } from '../../service/location-iq.service';
import { CommonModule } from '@angular/common';
import { switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CarouselComponent, CommonModule],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css'
})
export class BookingDetailsComponent implements OnInit {

  fromLatLng: { lat: number, lon: number } | undefined;
  toLatLng: { lat: number, lon: number } | undefined;


  constructor(private route: ActivatedRoute, private _locationIqService: LocationIqService) { }
  fromText: string | undefined;
  toText: string | undefined;
  distance: number | undefined;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const fromLat = parseFloat(params['fromLat']);
      const fromLon = parseFloat(params['fromLon']);
      const toLat = parseFloat(params['toLat']);
      const toLon = parseFloat(params['toLon']);

      if (!isNaN(fromLat) && !isNaN(fromLon) && !isNaN(toLat) && !isNaN(toLon)) {
        this.fromLatLng = { lat: fromLat, lon: fromLon };
        this.toLatLng = { lat: toLat, lon: toLon };
        this.calculateDistance();
      } else {
        console.error('Invalid coordinates received');
      }
    });
  }

  calculateDistance(): void {
    if (this.fromLatLng && this.toLatLng) {
      this._locationIqService.reverseGeocoding(this.fromLatLng?.lat, this.fromLatLng?.lon).subscribe({
        next: (res) => {
          this.fromText = res.display_name;
        }
      })

      timer(2000).pipe(
        switchMap(() => this._locationIqService.direction(this.fromLatLng?.lat!, this.fromLatLng?.lon!, this.toLatLng?.lat!, this.toLatLng?.lon!))
      ).subscribe({
        next: (res) => {
          this.distance = (res.routes[0].distance) / 1000;
        }
      })

      timer(1000).pipe(
        switchMap(() => this._locationIqService.reverseGeocoding(this.toLatLng?.lat!, this.toLatLng?.lon!))
      ).subscribe({
        next: (res) => {
          this.toText = res.display_name;
        }
      })
    }
    else {
      console.error('fromLatLng or toLatLng is undefined');
    }
    this.fromText = 'Narsinh Mehta Statue, Ahmedabad one mall street, Vastrapur, Vejalpur Taluka, Ahmedabad District, Gujarat, 380054, India'
    this.distance = 239.93
    this.toText = 'Rajkot West Taluka, રાજકોટ, Gujarat, 360005, India'
  }
}
