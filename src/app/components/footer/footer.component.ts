import { Component, HostListener } from '@angular/core';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollTop = window.scrollY;
    const container = document.querySelector('.background-container') as HTMLElement;
    const speed = 0.5; // Adjust the speed of the scroll effect

    if (container) {
      container.style.backgroundPositionY = -(scrollTop * speed) + 'px';
    }
  }

  constructor(readonly commonService: CommonService) { }
}
