import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Vehicles } from '../vehicle.interface';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  firestore = inject(Firestore)
  vehiclesCollection = collection(this.firestore,'Vehicles');
  websiteDetailCollection = collection(this.firestore,'WebsiteDetail')

  getVehicles():Observable<Vehicles[]>{
    return collectionData(this.vehiclesCollection,{
      idField: 'id'
    }) as Observable<Vehicles[]>;
  }

  addVechicles(vehicle:Vehicles):Observable<string>{
    const promise = addDoc(this.vehiclesCollection,vehicle).then(res => res.id);
    return from(promise);
  }

  removeVehicle(vehicleId : string):Observable<void>{
    const docRef = doc(this.firestore, 'Vehicles/',vehicleId);
    const promise = deleteDoc(docRef);
    return from(promise);
  }

  updateVehicle(id:string,vehicle:Vehicles):Observable<void>{
    const docRef = doc(this.firestore, 'Vehicles/',id);
    const promise = setDoc(docRef,vehicle);
    return from(promise);
  }

  addPhoneNumber(number:string):Observable<string>{
    const promise = addDoc(this.websiteDetailCollection,{'PhoneNo':number}).then(res=>res.id);
    return from(promise);
  }
  
  constructor() { }
}
