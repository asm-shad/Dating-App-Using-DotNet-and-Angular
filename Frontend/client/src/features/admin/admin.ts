import { Component, inject } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { UserManagment } from "./user-managment/user-managment";
import { PhotoManagment } from "./photo-managment/photo-managment";

@Component({
  selector: 'app-admin',
  imports: [UserManagment, PhotoManagment],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  protected accountService = inject(AccountService);
  activeTab = 'photos';
  tabs = [
    {label: 'Photo moderation', value: 'photos'},
    {label: 'User Managment', value: 'roles'},
  ];

  setTab(tab:string){
    this.activeTab = tab;
  }
}
