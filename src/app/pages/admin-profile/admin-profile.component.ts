import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profileadmin.service';


@Component({
  selector: 'app-admin-profile',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {

    admin: any = null;
  loading = true;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getMyProfile().subscribe({
      next: (data) => {
        this.admin = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

}
