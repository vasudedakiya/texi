import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationIqService } from '../../service/location-iq.service';
import { CommonModule } from '@angular/common';
import { switchMap, timer } from 'rxjs';
import { SharedDataService } from '../../service/shared-data.service';
import { UserDetails } from '../../vehicle.interface';
import { VehicleService } from '../../service/vehicle.service';
import { MessageService } from 'primeng/api';
import { FormsModule, NgForm } from '@angular/forms';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { emailJsPK, emailJsServiceId, emailJsTemplateId } from '../../firebase.config';
import jsPDF from 'jspdf';
import $ from 'jquery';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CarouselComponent, CommonModule, FormsModule],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css',
  providers: [MessageService]
})
export class BookingDetailsComponent implements OnInit {
  @ViewChild('bookingModalOpenButton', { static: false }) bookingModalOpenButton!: ElementRef;
  @ViewChild('bookingModal', { static: false }) bookingModal!: ElementRef;
  @ViewChild('invoice', { static: false }) invoiceElement!: ElementRef;
  fromLatLng: { lat: number, lon: number } | undefined;
  toLatLng: { lat: number, lon: number } | undefined;

  constructor(private route: ActivatedRoute,
    private _locationIqService: LocationIqService,
    private _sharedDataService: SharedDataService,
    private _router: Router,
    private _vehicleService: VehicleService,
    private messageService: MessageService
  ) { }
  fromText: string | undefined;
  toText: string | undefined;
  isCreateLoading: boolean = false;

  userName: string = '';
  mobileNo: string = '';
  email: string = '';
  priceText: number = 0;
  visible: boolean = false;
  textMessage: string = '';

  userDetails: UserDetails = {
    Name: '',
    Email: '',
    MoNumber: '',
    From: '',
    To: '',
    Distances: 0,
    Vehicle: '',
    Rate: 0,
    Date: new Date()
  }
  // distance: number | undefined;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const fromLat = parseFloat(params['fromLat']);
      const fromLon = parseFloat(params['fromLon']);
      const toLat = parseFloat(params['toLat']);
      const toLon = parseFloat(params['toLon']);
      this._sharedDataService.loadData();

      if (!isNaN(fromLat) && !isNaN(fromLon) && !isNaN(toLat) && !isNaN(toLon)) {
        this.fromLatLng = { lat: fromLat, lon: fromLon };
        this.toLatLng = { lat: toLat, lon: toLon };
        this.calculateDistance();
      }
      else if (this._sharedDataService.fromText != null || this._sharedDataService.toText != null) {
        this.fromText = this._sharedDataService.fromText;
        this.toText = this._sharedDataService.toText
      }
      else {
        this._router.navigate(['/dashboard']);
      }
    });
  }

  calculateDistance(): void {

    if (this.fromLatLng && this.toLatLng) {
      if (this._sharedDataService.fromText == null) {
        this._locationIqService.reverseGeocoding(this.fromLatLng?.lat, this.fromLatLng?.lon).subscribe({
          next: (res) => {
            this.fromText = res.display_name;
          }
        })
      }
      else {
        this.fromText = this._sharedDataService.fromText;
      }

      if (this._sharedDataService.toText == null) {
        timer(1000).pipe(
          switchMap(() => this._locationIqService.reverseGeocoding(this.toLatLng?.lat!, this.toLatLng?.lon!))
        ).subscribe({
          next: (res) => {
            this.toText = res.display_name;
          }
        })
      }
      else {
        this.toText = this._sharedDataService.toText
      }
    }
    else {
      console.error('fromLatLng or toLatLng is undefined');
    }
  }

  onSubmit(userForm: NgForm) {
    if (userForm.valid) {

      this.isCreateLoading = true;

      this.userDetails = {
        Name: this.userName,
        Email: this.email,
        MoNumber: this.mobileNo,
        From: this.fromText?.toString(),
        To: this.toText?.toString(),
        Distances: this.userDetails.Distances,
        Vehicle: this._sharedDataService.vehicle?.VehicleName,
        Rate: Math.floor(Number(this.priceText)),
        Date: this._sharedDataService.DateTime
      }
      this._sharedDataService.saveData();

      this._vehicleService.addUserDetails(this.userDetails).subscribe({
        next: (data) => {
          this.isCreateLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record Added' });
          this.visible = false;

          const templateParams = {
            Name: this.userDetails.Name,
            Email: this.userDetails.Email,
            MoNumber: this.userDetails.MoNumber,
            From: this.userDetails.From,
            To: this.userDetails.To,
            Vehicle: this.userDetails.Vehicle,
            Date: this.userDetails.Date,
            Rate: this.userDetails.Rate,
          };


          $('#bookingModal').hide();

          // Redirect to the dashboard
          this._router.navigate(['/dashboard']).then(() => {
            // Trigger download after navigation
            this.onDownload();
          });


          emailjs.send(emailJsServiceId, emailJsTemplateId, templateParams, { publicKey: emailJsPK })
            .then(
              (response) => {
                console.log('SUCCESS!', response);
              },
              (error) => {
                console.log('FAILED...', error);
              }
            );

          // this.textMessage = `*Name* : ${this.userDetails.Name} \n*From* : ${this.userDetails.From} \n*To* : ${this.userDetails.To} \n*Price* : ${this.userDetails.Rate} \n*Vehicle* : ${this.userDetails.Vehicle} \n*Phone* : ${this.userDetails.MoNumber}`;
          // document.location.href = `https://wa.me/${this._sharedDataService.PhoneNo}?text=${encodeURIComponent(this.textMessage)}`;
        },
        error: (err) => {
          this.isCreateLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        }
      });
    }
  }

  findDistance(): void {
    this._locationIqService.direction(this.fromLatLng?.lat!, this.fromLatLng?.lon!, this.toLatLng?.lat!, this.toLatLng?.lon!)
      .subscribe({
        next: (res) => {
          this.userDetails.Distances = this.findMinimumDistance(res);
          this.priceText = this.userDetails.Distances * Number(this._sharedDataService.vehicle?.Price);
        },
        error: (err) => {
          console.error('Error finding distance:', err);
        }
      });
  }

  findMinimumDistance(response: any): number {
    const distances: number[] = [];

    function extractDistances(obj: any) {
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          if (key === 'distance' && typeof obj[key] === 'number') {
            distances.push(obj[key]);
          } else {
            extractDistances(obj[key]);
          }
        }
      }
    }

    // Start extraction from the response object
    extractDistances(response);

    // Filter out zero distances and find the minimum distance
    const validDistances = distances.filter(distance => distance > 0);
    const minDistance = Math.min(...validDistances);

    return minDistance / 1000; // Convert meters to kilometers
  }

  onCardClick(vehicle: any): void {
    this._sharedDataService.vehicle = vehicle;
    this.userDetails.Vehicle = vehicle.VehicleName;
    this.bookingModalOpenButton.nativeElement.click();
    this.findDistance();
  }

  onDownload() {
    const doc = new jsPDF('l', 'pt', 'a4');
    const content = this.invoiceElement.nativeElement;

    doc.html(content, {
      callback: (doc) => {
        // Convert the PDF to a Blob
        const pdfBlob = doc.output('blob');
        // Create a URL for the Blob
        const blobUrl = URL.createObjectURL(pdfBlob);
        // Open the PDF in a new window or tab
        window.open(blobUrl, '_blank');
        location.reload();
      },
      x: 60,
      y: 1,
      html2canvas: {
        scale: 0.9,
      },
    });
  }

}
