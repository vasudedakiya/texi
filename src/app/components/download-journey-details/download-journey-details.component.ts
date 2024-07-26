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
  @Input() downloadData!: any; 
  @ViewChild('invoice') invoiceElement!: ElementRef;
  billNo : number = 0;

  formatBillNo(billNo: number): string {
    this.billNo = billNo;
    if (billNo < 1000) {
      // Zero-pad numbers less than 1000
      return billNo.toString().padStart(3, '0');
    } else {
      // Remove thousand separators for numbers 1000 and above
      return billNo.toString().replace(/,/g, '');
    }
  }
  
  onDownload() {
    const doc = new jsPDF('l', 'pt', 'a4');
    const content = this.invoiceElement.nativeElement;

    doc.html(content, {
      callback: (doc) => {
        doc.setLineWidth(100)
        doc.save(`${this.billNo}_Invoice.pdf`);
      },
      x: 60,
      y: 1,
      html2canvas: {
        scale: .9, // Increase the scale
      },
    });
  }
}
