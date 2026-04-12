import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'auth/resend-validation', loadComponent: () => import('./components/auth/resend-validation.component').then(m => m.ResendValidationComponent) },
  { path: 'auth/:mode', loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'destinations/:id', loadComponent: () => import('./components/destinations/destination-detail.component').then(m => m.DestinationDetailComponent) },
  { path: 'planner', loadComponent: () => import('./components/planner/planner.component').then(m => m.PlannerComponent), canActivate: [authGuard] },
  { path: 'events', loadComponent: () => import('./components/events/events.component').then(m => m.EventsComponent) },
  { path: 'actions', loadComponent: () => import('./components/actions/actions.component').then(m => m.ActionsComponent) },
  { path: 'community', loadComponent: () => import('./components/community/community.component').then(m => m.CommunityComponent) },
  { path: 'feedback', loadComponent: () => import('./components/feedback/feedback.component').then(m => m.FeedbackComponent) },
  { path: 'booking', loadComponent: () => import('./components/booking/booking.component').then(m => m.BookingComponent), canActivate: [authGuard] },
  { path: 'payment', loadComponent: () => import('./components/payment/payment.component').then(m => m.PaymentComponent), canActivate: [authGuard] },
  { path: 'bookings', loadComponent: () => import('./components/history/history.component').then(m => m.HistoryComponent), canActivate: [authGuard] },
  { path: 'history', loadComponent: () => import('./components/history/history.component').then(m => m.HistoryComponent), canActivate: [authGuard] },
  { path: 'reviews', loadComponent: () => import('./components/history/history.component').then(m => m.HistoryComponent), canActivate: [authGuard] },
  // Admin Dashboard — separate login gate built in
  { path: 'admin', loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent) },
  { path: '**', redirectTo: '' }
];
