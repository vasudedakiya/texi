import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule, DashboardSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'taxi-booking';
  isConfigRoute: boolean = false;

  constructor(private _router: Router) { }

  ngOnInit(): void {
    this._router.events.subscribe(() => {
      const url = this._router.url;
      this.isConfigRoute = url.includes('config');
    });
  }
}
