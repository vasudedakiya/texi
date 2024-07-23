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
    const dataToSave = {
      ...this,
      DateTime: new Date(this.DateTime).toISOString() // Ensure DateTime is a Date object before converting
    };
    sessionStorage.setItem('sharedData', JSON.stringify(dataToSave));
  }

  loadData() {
    const data = sessionStorage.getItem('sharedData');
    if (data) {
      const parsedData = JSON.parse(data);
      this.DateTime = new Date(parsedData.DateTime); // Convert ISO string back to Date object
      Object.assign(this, parsedData);
    }
  }
}
