import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';
import { BusyService } from '../../core/services/busy-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {
  protected creds: any = {};
  protected account = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);
  protected selectedTheme = signal<string>(localStorage.getItem('currentTheme') || 'dark');
  protected themes = themes;
  protected busyService = inject(BusyService);
  protected loading = signal(false);

  handleSelectTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('currentTheme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.handleSelect();
  }

    handleSelect() {
    const elem = document.activeElement as HTMLDivElement;
    if (elem) elem.blur();
  }

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  login() {
    this.loading.set(true);
    this.account.login(this.creds).subscribe(
      {
        next: result => { this.toast.success("Logged in succesfully"), this.router.navigateByUrl('/members'); },
        error: error => this.toast.error(error.error),
        complete: () => this.loading.set(false)
      }
    );
  }

  logout() {
    this.account.logout();
    this.creds = {};
    this.router.navigateByUrl('/');
  }
}
