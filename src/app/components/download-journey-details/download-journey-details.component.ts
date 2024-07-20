import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import { UserDetails } from '../../vehicle.interface';

@Component({
  selector: 'app-download-journey-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download-journey-details.component.html',
  styleUrls: ['./download-journey-details.component.css']
})
export class DownloadJourneyDetailsComponent {
  @Input() downloadData!: UserDetails; 
  @ViewChild('invoice') invoiceElement!: ElementRef;
  
  onDownload() {
    const doc = new jsPDF('l', 'pt', 'a4');
    const content = this.invoiceElement.nativeElement;

    doc.html(content, {
      callback: (doc) => {
        doc.setLineWidth(100)
        doc.save('Invoice.pdf');
      },
      x: 60,
      y: 1,
      html2canvas: {
        scale: .9, // Increase the scale
      },
    });
  }
}
