import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../types/member';
import { ImageUpload } from "../../../shared/image-upload/image-upload";
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../types/user';
import { FavoriteButton } from "../../../shared/favorite-button/favorite-button";
import { DeleteButton } from "../../../shared/delete-button/delete-button";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, FavoriteButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos)
      });
    }
  }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.memberService.editMode.set(false),
          this.loading.set(false);
        this.photos.update(photos => [...photos, photo]);
      },
      error: error => {
        console.log(error);
      }
    })
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe(
      {
        next: () => {
          const currentUser = this.accountService.currentUser();
          this.accountService.updateCurrentUserImage(photo.url);
          this.memberService.updateMainPhoto(photo.url);
        }
      }
    )
  }

  deletePhoto(photoId: number, photoUrl: string) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(photo => photo.id !== photoId));
        if (this.accountService.currentUser()?.imgUrl == photoUrl) {
          this.accountService.updateCurrentUserImage(null);
          this.memberService.updateMainPhoto(null);
        }
      },
      error: err => console.log(err)
    })
  }
}
