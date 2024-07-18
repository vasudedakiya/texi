import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import { SharedDataService } from '../../service/shared-data.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {

  constructor(readonly _sharedDataService : SharedDataService){}

}
