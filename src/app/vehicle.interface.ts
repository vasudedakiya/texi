import { Timestamp } from "@angular/fire/firestore"

export interface Vehicles {
    id: string
    ImageUrl: string,
    VehicleName: string,
    Desc: string,
    Price: number,
    Passengers: number,
    AirCondition: boolean,
    Luggage: number
}

export interface UserDetails {
    Name: string,
    Email: string,
    MoNumber: string,
    From: string | undefined,
    To: string | undefined,
    Distances: number,
    Vehicle: string | undefined,
    Rate: number,
    Date: Date | Timestamp,
    BillNo: number 
}

export interface AdminModel {
    id: string,
    UserId: string,
    Password: string
}