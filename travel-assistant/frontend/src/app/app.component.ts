import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChatWidgetComponent } from './components/chat-widget/chat-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ChatWidgetComponent],
  template: `
    <app-navbar *ngIf="showNavbar"></app-navbar>
    <router-outlet></router-outlet>
    <app-chat-widget></app-chat-widget>
  `
})
export class AppComponent {
  showNavbar = true;
  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.showNavbar = !event.urlAfterRedirects.startsWith('/admin');
    });
  }
}
