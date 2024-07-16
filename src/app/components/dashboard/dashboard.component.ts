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
import { SharedDataService } from '../../service/shared-data.service';

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
  date!: Date;
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

  constructor(private _locationIqService: LocationIqService,private _sharedDataService: SharedDataService) {
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
    this.fromText = this._sharedDataService.fromText = suggestion.display_name;
    this.fromSuggestions = [];
    this.fromLatLng = this._sharedDataService.fromLatLng = { lat: parseFloat(suggestion.lat), lon: parseFloat(suggestion.lon) };
  }

  selectToSuggestion(suggestion: any) {
    this.toText = this._sharedDataService.toText = suggestion.display_name;
    this.toSuggestions = [];
    this.toLatLng = this._sharedDataService.toLatLng = { lat: parseFloat(suggestion.lat), lon: parseFloat(suggestion.lon) };
  }

  combineDateTime() {
    const datePart = this.date;
    const timePart = this.selectedTime || new Date(); // Default to current time if selectedTime is undefined

    const combinedDateTime = new Date(
      datePart.getFullYear(),
      datePart.getMonth(),
      datePart.getDate(),
      timePart.getHours(),
      timePart.getMinutes(),
      timePart.getSeconds()
    );

    this._sharedDataService.DateTime = combinedDateTime;
    this._sharedDataService.saveData();
  }

  orderTaxiNow() {
    if (this.fromLatLng && this.toLatLng) {
     this.combineDateTime();
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
