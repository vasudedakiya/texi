import { Component, OnInit, inject } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { CarouselModule } from 'primeng/carousel';
import { CarouselComponent } from '../carousel/carousel.component';
import { VehicleService } from '../../service/vehicle.service';
import { Storage } from '@angular/fire/storage';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { LocationIqService } from '../../service/location-iq.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    CarouselModule,
    CarouselComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  date!: string;
  file!: File;
  fileName!: string;
  timeslot: string[] = ['4:00', '5:00'];
  fromText: string | undefined;
  fromTextUpdate = new Subject<string>();
  toText: string | undefined;
  toTextUpdate = new Subject<string>();
  fromSuggestions: any[] = [];
  toSuggestions: any[] = [];
  fromLatLng: { lat: number, lon: number } | undefined;
  toLatLng: { lat: number, lon: number } | undefined;
  today: Date = new Date();
  selectedTime: Date | undefined; 

  vehicleService = inject(VehicleService);
  private readonly _storage = inject(Storage);
  private readonly _router = inject(Router);

  constructor(private _locationIqService: LocationIqService) {
    this.fromTextUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(value => {
        if (value.trim().length === 0) {
          this.fromSuggestions = [];
        }
      }),
      filter(value => value.trim().length > 0),
      switchMap(value => this._locationIqService.autoComplete(value))
    ).subscribe({
      next: (res: any) => {
        this.fromSuggestions = res;
      },
      error: (err) => {
        console.error(err);
        this.fromSuggestions = [];
      }
    });

    this.toTextUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(value => {
        if (value.trim().length === 0) {
          this.toSuggestions = [];
        }
      }),
      filter(value => value.trim().length > 0),
      switchMap(value => this._locationIqService.autoComplete(value))
    ).subscribe({
      next: (res: any) => {
        this.toSuggestions = res;
      },
      error: (err) => {
        console.error(err);
        this.toSuggestions = [];
      }
    });
  }

  ngOnInit(): void {
    // Any other initialization logic
  }

  selectFromSuggestion(suggestion: any) {
    this.fromText = suggestion.display_name;
    this.fromSuggestions = [];
    this.fromLatLng = { lat: parseFloat(suggestion.lat), lon: parseFloat(suggestion.lon) };
  }

  selectToSuggestion(suggestion: any) {
    this.toText = suggestion.display_name;
    this.toSuggestions = [];
    this.toLatLng = { lat: parseFloat(suggestion.lat), lon: parseFloat(suggestion.lon) };
  }

  orderTaxiNow() {
    if (this.fromLatLng && this.toLatLng) {
      this._router.navigate(['/booking-details'], {
        queryParams: {
          fromLat: this.fromLatLng.lat,
          fromLon: this.fromLatLng.lon,
          toLat: this.toLatLng.lat,
          toLon: this.toLatLng.lon
        }
      });
    } else {
      console.error("Please select both 'From' and 'To' locations.");
    }
  }
}
