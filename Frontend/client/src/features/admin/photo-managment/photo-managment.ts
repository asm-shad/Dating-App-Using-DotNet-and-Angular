import { Component, inject, OnInit, signal } from '@angular/core';
import { Photo } from '../../../types/member';
import { AdminService } from '../../../core/services/admin-service';

@Component({
  selector: 'app-photo-managment',
  imports: [],
  templateUrl: './photo-managment.html',
  styleUrl: './photo-managment.css',
})
export class PhotoManagment implements OnInit {
  protected photos = signal<Photo[]>([]);
  adminService = inject(AdminService);

  ngOnInit(): void {
    this.adminService.getPhotosForApproval().subscribe({
      next: photos => {
        this.photos.set(photos);
      }
    })

  }

  approveImage(imageId: number) {
    return this.adminService.approvePhoto(imageId).subscribe({
        next: () => {
          this.photos.update(photos => photos.filter(p => p.id != imageId));
        },
        error: err => console.log(err)
      }
    )
  }
  rejectImage(imageId: number) {
    return this.adminService.rejectPhoto(imageId).subscribe({
      next: () => {
          this.photos.update(photos => photos.filter(p => p.id != imageId))
        },
      error: err => console.log(err)
    })
  }

}
