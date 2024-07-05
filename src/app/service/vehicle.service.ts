import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { UserDetails, Vehicles } from '../vehicle.interface';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  firestore = inject(Firestore)
  vehiclesCollection = collection(this.firestore,'Vehicles');
  websiteDetailCollection = collection(this.firestore,'WebsiteDetail')
  userDetailCollection = collection(this.firestore,'BookingDetails')

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

  getVehicleById(vehicleId: string): Observable<any> {
    const docRef = doc(this.firestore, `Vehicles/${vehicleId}`);
    return from(getDoc(docRef)).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          return { id: docSnapshot.id, ...docSnapshot.data() };
        } else {
          return null;
        }
      })
    );
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

  addUserDetails(userDetails:UserDetails):Observable<string>{
    const promise = addDoc(this.userDetailCollection,userDetails).then(res => res.id);
    return from(promise);
  }

  constructor() { }
}
