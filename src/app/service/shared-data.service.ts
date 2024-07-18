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
  PhoneNo: string = "";
  vehicle: Vehicles | undefined;
  DateTime: Date = new Date();

  savePhoneNo() {
    sessionStorage.setItem('PhoneNo', this.PhoneNo)
  }

  saveData() {
    sessionStorage.setItem('sharedData', JSON.stringify(this));
  }

  loadData() {
    const data = sessionStorage.getItem('sharedData');
    if (data) {
      Object.assign(this, JSON.parse(data));
    }
  }
}
