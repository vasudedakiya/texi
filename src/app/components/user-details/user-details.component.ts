import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  fromText: string = 'Location A';
  toText: string = 'Location B';
  userName: string = '';
  mobileNo: string = '';
  email: string = '';

  onSubmit() {
    // Handle form submission logic here
    console.log('Form submitted:', {
      userName: this.userName,
      mobileNo: this.mobileNo,
      email: this.email
    });
  }
}
