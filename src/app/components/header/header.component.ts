import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(readonly commonService: CommonService) { }
}
