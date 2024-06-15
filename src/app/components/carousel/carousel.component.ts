import { Component, OnInit, inject } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { CommonService } from '../../service/common.service'
import { TagModule } from 'primeng/tag';
import { Vehicles } from '../../vehicle.interface';
import { VehicleService } from '../../service/vehicle.service';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';


@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CarouselModule, TagModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit {
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
  constructor(private commonService: CommonService, private _storage: Storage) { }

  ngOnInit(): void {
    // this.products = this.commonService.customCarouselCards;
    this.vehicleService.getVehicles().subscribe(vehicles => {
      console.log(vehicles);
      this.products = vehicles;
      this.updateVehicleImages();
    })
  }
  private updateVehicleImages() {
    this.products.forEach(vehicle => {
      const imageRef = ref(this._storage, vehicle.ImageUrl);
      getDownloadURL(imageRef).then((url: string) => {
        console.log(url);
        vehicle.ImageUrl = url;
      }).catch((error: any) => {
        console.error(`Failed to get image URL for vehicle ${vehicle.Id}:`, error);
        vehicle.ImageUrl = 'path/to/default-image.png';
      });
    });
  }
}
