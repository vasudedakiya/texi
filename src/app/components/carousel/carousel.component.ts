import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { Vehicles } from '../../vehicle.interface';
import { VehicleService } from '../../service/vehicle.service';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from '../../service/shared-data.service';


@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CarouselModule, TagModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit {
  @Output() cardClick = new EventEmitter<any>();

  products: Vehicles[] = []
  responsiveOptions: any[] | undefined = [
    {
      breakpoint: '1600px',
      numVisible: 4,
      numScroll: 4
    },
    {
      breakpoint: '1200px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '568px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  vehicleService = inject(VehicleService)
  isBookingDetailsRoute: boolean = false;
  constructor(private _storage: Storage, public _activatedRoute : ActivatedRoute, private _router : Router,private _sharedData : SharedDataService) { }

  ngOnInit(): void {

    this._activatedRoute.url.subscribe(url => {
      this.isBookingDetailsRoute = url.some(segment => segment.path.includes('booking-details'));
    });
    // this.products = this.commonService.customCarouselCards;
    this.vehicleService.getVehicles().subscribe(vehicles => {
      this.products = vehicles;
      this.updateVehicleImages();
    })
  }
  private updateVehicleImages() {
    this.products.forEach(vehicle => {
      const imageRef = ref(this._storage, vehicle.ImageUrl);
      getDownloadURL(imageRef).then((url: string) => {
        vehicle.ImageUrl = url;
      }).catch((error: any) => {
        console.error(`Failed to get image URL for vehicle ${vehicle.id}:`, error);
        vehicle.ImageUrl = 'path/to/default-image.png';
      });
    });
  }

  onCardClick(vehicle : Vehicles) {
    this.cardClick.emit(vehicle);
    // this._sharedData.vehicle = vehicle;
    // if (this._router.url.includes('booking-details')) {
    //   this._router.navigate(['/user-details'],{
    //     queryParams: {
    //       fromLat: this._sharedData.fromLatLng?.lat,
    //       fromLon: this._sharedData.fromLatLng?.lon,
    //       toLat: this._sharedData.toLatLng?.lat,
    //       toLon: this._sharedData.toLatLng?.lon,
    //       cabTypId : vehicle.id,
    //     }
    //   });
    // }

    // if(this.isBookingDetailsRoute){
    //   let modal = document.getElementById("BookingModalOpen") as HTMLElement;
    //   modal.click();
    // }

  }
}
