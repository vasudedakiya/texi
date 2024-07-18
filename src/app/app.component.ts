import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { VehicleService } from './service/vehicle.service';
import { SharedDataService } from './service/shared-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'taxi-booking';
  isConfigRoute: boolean = false;

  constructor(private _router: Router, private _vehicleService: VehicleService, readonly _sharedDataService: SharedDataService) { }

  ngOnInit(): void {
    this._router.events.subscribe(() => {
      const url = this._router.url;
      this.isConfigRoute = url.includes('config');
    });

    if (this._sharedDataService.PhoneNo == "") {
      this._vehicleService.getPhoneNumber().subscribe((res: any) => {
        this._sharedDataService.PhoneNo = res[0].PhoneNo;
        this._sharedDataService.savePhoneNo();
      });
    }
  }
}
