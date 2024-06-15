import { Injectable } from '@angular/core';
import { Vehicles } from '../vehicle.interface';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  phoneNumber: string = "+91 7988979889";
  customCarouselCards: Vehicles[] = [
    {
      ImageUrl: "https://ld-wp73.template-help.com/wordpress/prod_26760/v2/wp-content/uploads/2019/11/Van.svg",
      VehicleName: "Van",
      Desc: "We provide taxi services, but we also provide transportation",
      Price: 6.5
    },
    {
      ImageUrl: "https://ld-wp73.template-help.com/wordpress/prod_26760/v2/wp-content/uploads/2019/11/Econom.svg",
      VehicleName: "Econom",
      Desc: "We provide taxi services, but we also provide transportation",
      Price: 3.5
    },
    {
      ImageUrl: "https://ld-wp73.template-help.com/wordpress/prod_26760/v2/wp-content/uploads/2019/11/Business.svg",
      VehicleName: "Business",
      Desc: "We provide taxi services, but we also provide transportation",
      Price: 2.5
    },
    {
      ImageUrl: "https://ld-wp73.template-help.com/wordpress/prod_26760/v2/wp-content/uploads/2019/11/SUV.svg",
      VehicleName: "SUV",
      Desc: "We provide taxi services, but we also provide transportation",
      Price: 1.5
    },
    {
      ImageUrl: "https://ld-wp73.template-help.com/wordpress/prod_26760/v2/wp-content/uploads/2019/11/Van.svg",
      VehicleName: "Van",
      Desc: "We provide taxi services, but we also provide transportation",
      Price: 6.5
    },
    {
      ImageUrl: "https://ld-wp73.template-help.com/wordpress/prod_26760/v2/wp-content/uploads/2019/11/Econom.svg",
      VehicleName: "Econom",
      Desc: "We provide taxi services, but we also provide transportation",
      Price: 3.5
    },
    {
      ImageUrl: "https://ld-wp73.template-help.com/wordpress/prod_26760/v2/wp-content/uploads/2019/11/Business.svg",
      VehicleName: "Business",
      Desc: "We provide taxi services, but we also provide transportation",
      Price: 2.5
    },
    {
      ImageUrl: "https://ld-wp73.template-help.com/wordpress/prod_26760/v2/wp-content/uploads/2019/11/SUV.svg",
      VehicleName: "SUV",
      Desc: "We provide taxi services, but we also provide transportation",
      Price: 1.5
    }
  ]
}
