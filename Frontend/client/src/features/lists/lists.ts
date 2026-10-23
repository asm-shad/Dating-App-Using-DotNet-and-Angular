import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member } from '../../types/member';
import { MemberCard } from "../members/member-card/member-card";
import { Paginator } from "../../shared/paginator/paginator";
import { LikedParams, PaginatedResult } from '../../types/pagination';

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists implements OnInit {
  private likesService = inject(LikesService);
  protected paginatedMemebers = signal<PaginatedResult<Member> | null>(null);
  protected likedParams = new LikedParams();

  tabs = [
    { label: 'Liked', value: 'liked' },
    { label: 'Likes Me', value: 'likedBy' },
    { label: 'Mutual', value: 'mutual' },
  ];

  ngOnInit(): void {
    this.loadLikes();
  }

  setPredicate(predicate: string) {
    if (this.likedParams.Predicate !== predicate) {
      this.likedParams.Predicate = predicate;
      this.likedParams.pageNumber = 1;
      this.loadLikes();
    }
  }

  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.likedParams.pageSize = event.pageSize;
    this.likedParams.pageNumber = event.pageNumber;
    this.loadLikes();
  }


  loadLikes() {
    this.likesService.getLikes(this.likedParams).subscribe(
      {
        next: members => this.paginatedMemebers.set(members as PaginatedResult<Member>)
      }
    )
  }
}
