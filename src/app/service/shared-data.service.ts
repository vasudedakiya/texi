import { Injectable } from '@angular/core';
import { Vehicles } from '../vehicle.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }

  fromText: string | undefined;
  toText: string | undefined;
  fromLatLng: { lat: number, lon: number } | undefined;
  toLatLng: { lat: number, lon: number } | undefined;
  PhoneNo : string | undefined;
  vehicle : Vehicles | undefined;

}
