import { Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { MessageService } from '../../../core/services/message-service';
import { Message } from '../../../types/message';
import { DatePipe } from '@angular/common';
import { DateAgoPipe } from '../../../core/pipes/pipes/date-ago-pipe';
import { FormsModule } from '@angular/forms';
import { PresenceService } from '../../../core/services/presence-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, DateAgoPipe, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css',
})
export class MemberMessages implements OnInit, OnDestroy {
  @ViewChild('messageEndRef') messageEndRef!: ElementRef;
  private memberService = inject(MemberService);
  protected messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  protected messagesContnet = '';
  protected presenseService = inject(PresenceService);

  constructor() {
    effect(() => {
      const currentMessages = this.messageService.messageThread();
      if (currentMessages.length > 0) {
        this.scrollToBottom();
      }
    })
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe({
      next: params => {
        const otherUserId = params.get('id');
        if (!otherUserId) throw new Error('Cannot connect to hub');
        this.messageService.createHubConnection(otherUserId);
      }
    }
    )
  }

  sendMessage() {
    const recipientId = this.memberService.member()?.id;
    if (!recipientId) return;
    this.messageService.sendMessage(recipientId, this.messagesContnet)?.then(() => {
      this.messagesContnet = '';
    })

  }

  scrollToBottom() {
    setTimeout(() => this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' }));
  }

}
