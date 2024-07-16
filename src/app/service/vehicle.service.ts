import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, setDoc, query, where, getDocs, orderBy } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { AdminModel, UserDetails, Vehicles } from '../vehicle.interface';
import { ref } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  firestore = inject(Firestore)
  vehiclesCollection = collection(this.firestore,'Vehicles');
  websiteDetailCollection = collection(this.firestore,'WebsiteDetail')
  userDetailCollection = collection(this.firestore,'BookingDetails')
  adminCollection = collection(this.firestore,'Admin')
  
  constructor() { }

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

  getAllTrips():Observable<UserDetails[]>{
    return collectionData(this.userDetailCollection,{
      idField: 'id'
    }) as Observable<UserDetails[]>;
  }

  getUpcomingTrips(): Observable<UserDetails[]> {
    const currentDate = new Date();
    const upcomingTripsQuery = query(this.userDetailCollection, where('Date', '>=', currentDate),orderBy('Date', 'asc'));

    return from(getDocs(upcomingTripsQuery)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as unknown as UserDetails));
      })
    );
  }

  getTripHistory(): Observable<UserDetails[]> {
    const currentDate = new Date();
    const upcomingTripsQuery = query(this.userDetailCollection, where('Date', '<', currentDate),orderBy('Date', 'desc'));

    return from(getDocs(upcomingTripsQuery)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as unknown as UserDetails));
      })
    );
  }

  getCustomers(): Observable<UserDetails[]> {
    const upcomingTripsQuery = query(this.userDetailCollection, orderBy('Email'));
  
    return from(getDocs(upcomingTripsQuery)).pipe(
      map(snapshot => {
        const uniqueEmails = new Set<string>();
        const uniqueCustomers: UserDetails[] = [];
  
        snapshot.docs.forEach(doc => {
          const customer = {
            id: doc.id,
            ...doc.data()
          } as unknown as UserDetails;
  
          // Check if the email is already in the Set
          if (!uniqueEmails.has(customer.Email)) {
            uniqueEmails.add(customer.Email);
            uniqueCustomers.push(customer);
          }
        });
        return uniqueCustomers;
      })
    );
  }

  getAdmins():Observable<AdminModel[]>{
    return collectionData(this.adminCollection,{
      idField: 'id'
    }) as Observable<AdminModel[]>;
  }

  loginAdmin(userId: string, password: string): Observable<AdminModel | null> {
    const adminQuery = query(
      this.adminCollection,
      where('UserId', '==', userId),
      where('Password', '==', password)
    );

    return from(getDocs(adminQuery)).pipe(
      map(snapshot => {
        const adminDoc = snapshot.docs[0];
        if (adminDoc) {
          return {
            id: adminDoc.id,
            UserId: adminDoc.data()['UserId'],
            Password: adminDoc.data()['Password']
          } as AdminModel;
        } else {
          return null; // Return null if no admin found
        }
      })
    );
  }

}
