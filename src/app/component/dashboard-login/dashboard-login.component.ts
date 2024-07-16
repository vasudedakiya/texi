import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../service/vehicle.service';
import { AdminModel } from '../../vehicle.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard-login',
  standalone: true,
  imports: [ReactiveFormsModule ,CommonModule],
  templateUrl: './dashboard-login.component.html',
  styleUrl: './dashboard-login.component.css'
})
export class DashboardLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private _fb: FormBuilder,
    private _vehicleService: VehicleService,
    private _router: Router
  ) {
    this.loginForm = this._fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { userId, password } = this.loginForm.value;

    this._vehicleService.loginAdmin(userId, password).subscribe({
      next: (admin: AdminModel | null) => {
        this.isLoading = false;
        if (admin) {
          this._router.navigate(['config/trips']); // Redirect to dashboard
        } else {
          this._router.navigate(['dashboard']); // Redirect to dashboard
          this.errorMessage = 'Invalid User ID or Password';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred. Please try again.';
      }
    });
  }
}
