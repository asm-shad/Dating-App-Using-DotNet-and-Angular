import { Component, inject, signal } from '@angular/core';
import { Nav } from "../layout/nav/nav";
import { Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { ConfirmDialog } from "../shared/confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet, NgClass, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Dating App');
  protected router = inject(Router);
}
