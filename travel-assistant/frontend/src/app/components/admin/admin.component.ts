import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <!-- Admin Login Gate -->
  <div class="admin-login" *ngIf="!isAdmin">
    <div class="al-card">
      <div class="al-logo">🛡 Tripx Admin</div>
      <h2>Admin Login</h2>
      <p>Restricted access — Admin credentials only</p>
      <div class="alert alert-error" *ngIf="loginError">{{loginError}}</div>
      <div class="form-group"><label>Email</label>
        <input type="email" [(ngModel)]="loginForm.email" placeholder="admin@tripx.com">
      </div>
      <div class="form-group"><label>Password</label>
        <input type="password" [(ngModel)]="loginForm.password" placeholder="••••••••">
      </div>
      <button class="btn btn-primary btn-full" (click)="adminLogin()" [disabled]="logging">
        {{logging ? 'Verifying...' : '🔐 Admin Login'}}
      </button>
    </div>
  </div>

  <!-- Admin Dashboard -->
  <div class="admin-shell" *ngIf="isAdmin">
    <!-- Sidebar -->
    <aside class="admin-sidebar" [class.collapsed]="sidebarCollapsed">
      <div class="sidebar-logo" (click)="sidebarCollapsed=!sidebarCollapsed">
        <span>🛡</span><span class="logo-text">Tripx Admin</span>
      </div>
      <nav class="sidebar-nav">
        <a *ngFor="let m of menu" (click)="activeSection=m.key" [class.active]="activeSection===m.key">
          <span class="nav-icon">{{m.icon}}</span><span class="nav-label">{{m.label}}</span>
        </a>
      </nav>
      <button class="sidebar-logout" (click)="logout()">🚪 <span class="nav-label">Logout</span></button>
    </aside>

    <!-- Main content -->
    <main class="admin-main">
      <div class="admin-topbar">
        <h1>{{getTitle()}}</h1>
        <div class="topbar-right">
          <span class="admin-badge">ADMIN</span>
          <span class="admin-name">{{currentUser?.name}}</span>
        </div>
      </div>

      <!-- Dashboard -->
      <div *ngIf="activeSection==='dashboard'" class="section-content">
        <div class="loading-spinner" *ngIf="loadingStats"><div class="spinner"></div></div>
        <ng-container *ngIf="!loadingStats && stats">
          <!-- KPI Cards -->
          <div class="kpi-grid">
            <div class="kpi-card blue">
              <div class="kpi-icon">👥</div>
              <div class="kpi-value">{{stats.totalUsers | number}}</div>
              <div class="kpi-label">Total Users</div>
              <div class="kpi-sub">{{stats.activeUsers}} active</div>
            </div>
            <div class="kpi-card green">
              <div class="kpi-icon">🎟</div>
              <div class="kpi-value">{{stats.totalBookings | number}}</div>
              <div class="kpi-label">Total Bookings</div>
              <div class="kpi-sub">{{stats.confirmedBookings}} confirmed</div>
            </div>
            <div class="kpi-card gold">
              <div class="kpi-icon">💰</div>
              <div class="kpi-value">₹{{stats.totalRevenue | number:'1.0-0'}}</div>
              <div class="kpi-label">Total Revenue</div>
              <div class="kpi-sub">Avg ₹{{stats.avgBookingValue | number:'1.0-0'}}/booking</div>
            </div>
            <div class="kpi-card red">
              <div class="kpi-icon">✈</div>
              <div class="kpi-value">{{stats.totalTrips | number}}</div>
              <div class="kpi-label">Trip Plans</div>
              <div class="kpi-sub">Top: {{stats.topDestination}}</div>
            </div>
            <div class="kpi-card purple">
              <div class="kpi-icon">📅</div>
              <div class="kpi-value">{{stats.todayBookings}}</div>
              <div class="kpi-label">Today's Bookings</div>
              <div class="kpi-sub">₹{{stats.todayRevenue | number:'1.0-0'}} today</div>
            </div>
            <div class="kpi-card teal">
              <div class="kpi-icon">⭐</div>
              <div class="kpi-value">{{stats.totalReviews}}</div>
              <div class="kpi-label">Reviews</div>
              <div class="kpi-sub">Top transport: {{stats.topTransportMode}}</div>
            </div>
          </div>

          <!-- Revenue Chart -->
          <div class="chart-card" *ngIf="revenueByDest.length">
            <h3>💰 Revenue by Destination</h3>
            <div class="bar-chart">
              <div class="bar-row" *ngFor="let r of revenueByDest">
                <div class="bar-label">{{r.destination}}</div>
                <div class="bar-track">
                  <div class="bar-fill" [style.width]="getBarWidth(r.revenue)+'%'"></div>
                </div>
                <div class="bar-value">₹{{r.revenue | number:'1.0-0'}}</div>
              </div>
            </div>
          </div>

          <!-- Alert Row -->
          <div class="alert-row">
            <div class="alert-stat warn">
              <span>⏳ Pending Payments</span>
              <strong>{{stats.pendingPayments}}</strong>
            </div>
            <div class="alert-stat danger">
              <span>❌ Cancelled Bookings</span>
              <strong>{{stats.cancelledBookings}}</strong>
            </div>
          </div>
        </ng-container>
      </div>

      <!-- Users Section -->
      <div *ngIf="activeSection==='users'" class="section-content">
        <div class="section-toolbar">
          <input type="text" [(ngModel)]="userSearch" placeholder="Search by name or email..." class="search-input" (input)="loadUsers()">
          <span class="result-count">{{users.length}} users</span>
        </div>
        <div class="loading-spinner" *ngIf="loadingUsers"><div class="spinner"></div></div>
        <div class="data-table" *ngIf="!loadingUsers">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Email</th><th>City</th>
                <th>Phone</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of users">
                <td>#{{u.id}}</td>
                <td><strong>{{u.name}}</strong></td>
                <td>{{u.email}}</td>
                <td>{{u.city || '—'}}</td>
                <td>{{u.phone || '—'}}</td>
                <td><span class="role-badge" [class.admin]="u.role==='ADMIN'">{{u.role}}</span></td>
                <td>{{u.createdAt | date:'dd MMM y'}}</td>
                <td><span class="status-dot" [class.active]="u.enabled" [class.inactive]="!u.enabled">{{u.enabled ? '● Active' : '● Blocked'}}</span></td>
                <td>
                  <button class="btn-action" (click)="viewUser(u.id)">👁 View</button>
                  <button class="btn-action warn" (click)="toggleUser(u.id)" *ngIf="u.role!=='ADMIN'">{{u.enabled ? '🚫 Block' : '✅ Unblock'}}</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <button (click)="userPage=userPage-1;loadUsers()" [disabled]="userPage===0">← Prev</button>
            <span>Page {{userPage+1}}</span>
            <button (click)="userPage=userPage+1;loadUsers()">Next →</button>
          </div>
        </div>

        <!-- User Detail Modal -->
        <div class="modal-overlay" *ngIf="selectedUser" (click)="selectedUser=null">
          <div class="modal-lg" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>👤 {{selectedUser.user?.name}}</h2>
              <button (click)="selectedUser=null" class="close-btn">✕</button>
            </div>
            <div class="user-detail-grid">
              <div class="ud-info">
                <div class="ud-row"><span>Email</span><strong>{{selectedUser.user?.email}}</strong></div>
                <div class="ud-row"><span>Phone</span><strong>{{selectedUser.user?.phone || '—'}}</strong></div>
                <div class="ud-row"><span>City</span><strong>{{selectedUser.user?.city || '—'}}</strong></div>
                <div class="ud-row"><span>Joined</span><strong>{{selectedUser.user?.joinedAt | date:'dd MMM yyyy'}}</strong></div>
                <div class="ud-row highlight"><span>Total Spent</span><strong>₹{{selectedUser.summary?.totalSpent | number:'1.0-0'}}</strong></div>
                <div class="ud-row"><span>Total Bookings</span><strong>{{selectedUser.summary?.totalBookings}}</strong></div>
                <div class="ud-row"><span>Total Trips</span><strong>{{selectedUser.summary?.totalTrips}}</strong></div>
              </div>
              <div class="ud-history">
                <h4>Recent Bookings</h4>
                <div class="history-item" *ngFor="let b of selectedUser.bookings | slice:0:5">
                  <span class="hi-route">{{b.fromLocation}} → {{b.toLocation}}</span>
                  <span class="hi-type">{{b.bookingType}}</span>
                  <span class="hi-amount">₹{{b.totalAmount | number}}</span>
                  <span class="hi-status" [class]="'hs-'+b.status?.toLowerCase()">{{b.status}}</span>
                </div>
                <div *ngIf="!selectedUser.bookings?.length" class="no-data">No bookings yet</div>
                <h4 style="margin-top:16px">Recent Trips</h4>
                <div class="history-item" *ngFor="let t of selectedUser.trips | slice:0:5">
                  <span class="hi-route">{{t.source}} → {{t.destination}}</span>
                  <span class="hi-type">{{t.budgetType}}</span>
                  <span class="hi-amount">₹{{t.totalBudget | number}}</span>
                  <span class="hi-status">{{t.status}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bookings Section -->
      <div *ngIf="activeSection==='bookings'" class="section-content">
        <div class="section-toolbar">
          <select [(ngModel)]="bookingStatusFilter" (change)="loadBookings()" class="filter-select">
            <option value="">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="PENDING">Pending</option>
          </select>
          <select [(ngModel)]="bookingTypeFilter" (change)="loadBookings()" class="filter-select">
            <option value="">All Types</option>
            <option value="FLIGHT">Flight</option>
            <option value="TRAIN">Train</option>
            <option value="BUS">Bus</option>
            <option value="CAB">Cab</option>
          </select>
          <span class="result-count">{{bookings.length}} bookings</span>
        </div>
        <div class="loading-spinner" *ngIf="loadingBookings"><div class="spinner"></div></div>
        <div class="data-table" *ngIf="!loadingBookings">
          <table>
            <thead>
              <tr>
                <th>Ref #</th><th>User</th><th>Type</th><th>Route</th>
                <th>Travel Date</th><th>Passengers</th><th>Amount</th>
                <th>Payment</th><th>Status</th><th>Booked At</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of bookings">
                <td><code>{{b.bookingReference}}</code></td>
                <td>{{b.user?.name || '—'}}</td>
                <td><span class="type-chip">{{getIcon(b.bookingType)}} {{b.bookingType}}</span></td>
                <td>{{b.fromLocation}} → {{b.toLocation}}</td>
                <td>{{b.travelDate | date:'dd MMM y'}}</td>
                <td>{{b.passengers}}</td>
                <td><strong>₹{{b.totalAmount | number}}</strong></td>
                <td><span class="badge" [class]="'badge-'+b.paymentStatus?.toLowerCase()">{{b.paymentStatus}}</span></td>
                <td><span class="badge" [class]="'badge-'+b.status?.toLowerCase()">{{b.status}}</span></td>
                <td>{{b.bookedAt | date:'dd MMM y, HH:mm'}}</td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <button (click)="bookingPage=bookingPage-1;loadBookings()" [disabled]="bookingPage===0">← Prev</button>
            <span>Page {{bookingPage+1}}</span>
            <button (click)="bookingPage=bookingPage+1;loadBookings()">Next →</button>
          </div>
        </div>
      </div>

      <!-- Payments Section -->
      <div *ngIf="activeSection==='payments'" class="section-content">
        <div class="section-toolbar">
          <select [(ngModel)]="paymentStatusFilter" (change)="loadPayments()" class="filter-select">
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <span class="result-count">{{payments.length}} payments</span>
        </div>
        <div class="loading-spinner" *ngIf="loadingPayments"><div class="spinner"></div></div>
        <div class="data-table" *ngIf="!loadingPayments">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th><th>User</th><th>Amount</th>
                <th>Method</th><th>Card/UPI</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of payments">
                <td><code>{{p.transactionId}}</code></td>
                <td>{{p.user?.name || '—'}}</td>
                <td><strong>₹{{p.amount | number}}</strong></td>
                <td>{{p.paymentMethod}}</td>
                <td>{{p.cardLast4 ? '****'+p.cardLast4 : p.upiId || '—'}}</td>
                <td><span class="badge" [class]="'badge-'+p.status?.toLowerCase()">{{p.status}}</span></td>
                <td>{{p.initiatedAt | date:'dd MMM y, HH:mm'}}</td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <button (click)="paymentPage=paymentPage-1;loadPayments()" [disabled]="paymentPage===0">← Prev</button>
            <span>Page {{paymentPage+1}}</span>
            <button (click)="paymentPage=paymentPage+1;loadPayments()">Next →</button>
          </div>
        </div>
      </div>

      <!-- Trips Section -->
      <div *ngIf="activeSection==='trips'" class="section-content">
        <div class="section-toolbar">
          <input type="text" [(ngModel)]="tripDestFilter" placeholder="Filter by destination..." class="search-input" (input)="loadTrips()">
          <span class="result-count">{{trips.length}} trip plans</span>
        </div>
        <div class="loading-spinner" *ngIf="loadingTrips"><div class="spinner"></div></div>
        <div class="data-table" *ngIf="!loadingTrips">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>User</th><th>Route</th><th>Dates</th>
                <th>People</th><th>Budget</th><th>Transport</th><th>Total</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of trips">
                <td>#{{t.id}}</td>
                <td>{{t.user?.name || '—'}}</td>
                <td><strong>{{t.source}} → {{t.destination}}</strong></td>
                <td>{{t.startDate | date:'dd MMM'}} – {{t.endDate | date:'dd MMM y'}}</td>
                <td>{{t.numberOfPeople}}</td>
                <td><span class="badge" [class]="'badge-'+t.budgetType?.toLowerCase()">{{t.budgetType}}</span></td>
                <td>{{t.transportMode}}</td>
                <td><strong>₹{{t.totalBudget | number}}</strong></td>
                <td><span class="badge badge-confirmed">{{t.status}}</span></td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <button (click)="tripPage=tripPage-1;loadTrips()" [disabled]="tripPage===0">← Prev</button>
            <span>Page {{tripPage+1}}</span>
            <button (click)="tripPage=tripPage+1;loadTrips()">Next →</button>
          </div>
        </div>
      </div>

      <!-- Destinations Management -->
      <div *ngIf="activeSection==='destinations'" class="section-content">
        <div class="section-toolbar">
          <button class="btn btn-primary" (click)="showAddDest=!showAddDest">+ Add Destination</button>
        </div>
        <div class="add-dest-form card" *ngIf="showAddDest" style="padding:24px;margin-bottom:24px;">
          <h3>Add New Destination</h3>
          <div class="grid-2">
            <div class="form-group"><label>Name</label><input type="text" [(ngModel)]="newDest.name"></div>
            <div class="form-group"><label>State</label><input type="text" [(ngModel)]="newDest.state"></div>
            <div class="form-group"><label>Type</label>
              <select [(ngModel)]="newDest.type">
                <option *ngFor="let t of ['BEACH','MOUNTAIN','HERITAGE','NATURE','PILGRIMAGE','ADVENTURE','CITY']" [value]="t">{{t}}</option>
              </select>
            </div>
            <div class="form-group"><label>Best Season</label><input type="text" [(ngModel)]="newDest.bestSeason"></div>
            <div class="form-group"><label>Low Budget/day (₹)</label><input type="number" [(ngModel)]="newDest.lowBudgetPerDay"></div>
            <div class="form-group"><label>Mid Budget/day (₹)</label><input type="number" [(ngModel)]="newDest.midBudgetPerDay"></div>
            <div class="form-group"><label>Luxury Budget/day (₹)</label><input type="number" [(ngModel)]="newDest.luxuryBudgetPerDay"></div>
            <div class="form-group"><label>Image URL</label><input type="text" [(ngModel)]="newDest.imageUrl"></div>
          </div>
          <div class="form-group"><label>Description</label><textarea [(ngModel)]="newDest.description"></textarea></div>
          <button class="btn btn-primary" (click)="addDestination()">Save Destination</button>
        </div>
        <div class="dest-admin-grid">
          <div class="dest-admin-card" *ngFor="let d of adminDestinations">
            <img [src]="d.imageUrl" [alt]="d.name" style="width:100%;height:140px;object-fit:cover;">
            <div class="dac-body">
              <h4>{{d.name}}, {{d.state}}</h4>
              <div class="dac-type">{{d.type}}</div>
              <div class="dac-stats">
                <span>⭐ {{d.rating}}</span>
                <span>₹{{d.lowBudgetPerDay | number}}–{{d.luxuryBudgetPerDay | number}}</span>
              </div>
              <div class="dac-actions">
                <button class="btn-action" (click)="editDest(d)">✏ Edit</button>
                <button class="btn-action danger" (click)="deleteDest(d.id)">🗑 Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  `,
  styles: [`
    /* ── Admin Login ── */
    .admin-login{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a2e,#0f3460)}
    .al-card{background:white;border-radius:24px;padding:48px;width:420px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)}
    .al-logo{font-size:1.8rem;font-weight:700;color:#e94560;margin-bottom:16px;font-family:'Playfair Display',serif}
    .al-card h2{margin-bottom:8px;color:#1a1a2e}
    .al-card p{color:#6c7293;font-size:14px;margin-bottom:28px}
    .btn-full{width:100%;justify-content:center}
    /* ── Shell ── */
    .admin-shell{display:flex;min-height:100vh;background:#f0f2f8}
    /* ── Sidebar ── */
    .admin-sidebar{width:240px;background:linear-gradient(180deg,#1a1a2e 0%,#0f3460 100%);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:100;transition:width 0.2s}
    .admin-sidebar.collapsed{width:70px}
    .sidebar-logo{display:flex;align-items:center;gap:12px;padding:24px 20px;color:white;font-size:1.1rem;font-weight:700;font-family:'Playfair Display',serif;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.1)}
    .logo-text{white-space:nowrap;overflow:hidden;font-size:15px}
    .sidebar-nav{flex:1;padding:16px 8px;display:flex;flex-direction:column;gap:4px}
    .sidebar-nav a{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;color:rgba(255,255,255,0.7);text-decoration:none;cursor:pointer;transition:all 0.15s;font-size:14px;font-weight:500}
    .sidebar-nav a:hover,.sidebar-nav a.active{background:rgba(233,69,96,0.2);color:white}
    .sidebar-nav a.active{background:rgba(233,69,96,0.3);border-left:3px solid #e94560}
    .nav-icon{font-size:18px;flex-shrink:0}
    .nav-label{white-space:nowrap;overflow:hidden}
    .sidebar-logout{display:flex;align-items:center;gap:12px;padding:16px 22px;color:rgba(255,255,255,0.5);background:none;border:none;cursor:pointer;font-size:14px;border-top:1px solid rgba(255,255,255,0.1);margin-top:auto;transition:color 0.2s}
    .sidebar-logout:hover{color:#e94560}
    /* ── Main ── */
    .admin-main{margin-left:240px;flex:1;display:flex;flex-direction:column}
    .admin-topbar{background:white;padding:20px 32px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);position:sticky;top:0;z-index:50}
    .admin-topbar h1{font-size:1.4rem;color:#1a1a2e}
    .topbar-right{display:flex;align-items:center;gap:12px}
    .admin-badge{background:#e94560;color:white;padding:4px 12px;border-radius:50px;font-size:12px;font-weight:700}
    .admin-name{font-weight:600;color:#1a1a2e;font-size:14px}
    .section-content{padding:32px;flex:1}
    /* ── KPI ── */
    .kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:28px}
    .kpi-card{border-radius:20px;padding:24px;color:white;position:relative;overflow:hidden}
    .kpi-card::before{content:'';position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.1)}
    .kpi-card.blue{background:linear-gradient(135deg,#1565c0,#42a5f5)}
    .kpi-card.green{background:linear-gradient(135deg,#2e7d32,#66bb6a)}
    .kpi-card.gold{background:linear-gradient(135deg,#e65100,#ffa726)}
    .kpi-card.red{background:linear-gradient(135deg,#c62828,#ef5350)}
    .kpi-card.purple{background:linear-gradient(135deg,#4a148c,#ab47bc)}
    .kpi-card.teal{background:linear-gradient(135deg,#00695c,#26a69a)}
    .kpi-icon{font-size:28px;margin-bottom:8px;opacity:0.9}
    .kpi-value{font-size:1.8rem;font-weight:700;font-family:'Playfair Display',serif;margin-bottom:4px}
    .kpi-label{font-size:13px;opacity:0.85;font-weight:500}
    .kpi-sub{font-size:12px;opacity:0.7;margin-top:4px}
    /* ── Chart ── */
    .chart-card{background:white;border-radius:20px;padding:24px;box-shadow:0 4px 16px rgba(0,0,0,0.06);margin-bottom:20px}
    .chart-card h3{margin-bottom:20px;color:#1a1a2e}
    .bar-chart{display:flex;flex-direction:column;gap:10px}
    .bar-row{display:flex;align-items:center;gap:12px}
    .bar-label{width:100px;font-size:13px;font-weight:600;color:#1a1a2e;flex-shrink:0}
    .bar-track{flex:1;background:#f0f2f8;border-radius:50px;height:24px;overflow:hidden}
    .bar-fill{height:100%;background:linear-gradient(135deg,#e94560,#0f3460);border-radius:50px;transition:width 0.6s ease}
    .bar-value{width:100px;font-size:13px;font-weight:600;color:#e94560;text-align:right}
    .alert-row{display:flex;gap:16px;margin-top:4px}
    .alert-stat{flex:1;padding:16px 20px;border-radius:14px;display:flex;justify-content:space-between;align-items:center}
    .alert-stat.warn{background:#fff8e1;border-left:4px solid #ff9800}
    .alert-stat.danger{background:#ffebee;border-left:4px solid #f44336}
    .alert-stat span{font-size:14px;color:#4a4a6a}
    .alert-stat strong{font-size:1.5rem;font-weight:700}
    /* ── Toolbar ── */
    .section-toolbar{display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap}
    .search-input{padding:10px 16px;border:2px solid #e8ecf4;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;flex:1;min-width:200px}
    .search-input:focus{border-color:#e94560}
    .filter-select{padding:10px 14px;border:2px solid #e8ecf4;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;background:white}
    .result-count{font-size:13px;color:#6c7293;margin-left:auto}
    /* ── Table ── */
    .data-table{background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06)}
    table{width:100%;border-collapse:collapse}
    thead{background:#1a1a2e;color:white}
    th{padding:14px 16px;text-align:left;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
    td{padding:14px 16px;font-size:13px;border-bottom:1px solid #f0f2f8;vertical-align:middle}
    tbody tr:hover{background:#fafbff}
    code{background:#f0f2f8;padding:2px 8px;border-radius:6px;font-size:12px;color:#e94560}
    .role-badge{padding:3px 10px;border-radius:50px;font-size:11px;font-weight:700;background:#e3f2fd;color:#1565c0}
    .role-badge.admin{background:rgba(233,69,96,0.1);color:#e94560}
    .status-dot.active{color:#2e7d32;font-weight:600;font-size:13px}
    .status-dot.inactive{color:#c62828;font-weight:600;font-size:13px}
    .type-chip{background:#f0f2f8;padding:4px 10px;border-radius:8px;font-size:12px;font-weight:600}
    .badge-success,.badge-confirmed,.badge-paid{background:#e8f5e9;color:#2e7d32}
    .badge-failed,.badge-cancelled{background:#ffebee;color:#c62828}
    .badge-pending{background:#fff8e1;color:#e65100}
    .badge-refunded{background:#e3f2fd;color:#1565c0}
    .badge-low{background:#e8f5e9;color:#2e7d32}
    .badge-mid{background:#fff8e1;color:#e65100}
    .badge-luxury{background:#fce4ec;color:#c2185b}
    .btn-action{padding:5px 12px;border-radius:8px;border:1px solid #e8ecf4;background:white;font-size:12px;cursor:pointer;margin-right:4px;transition:all 0.15s}
    .btn-action:hover{background:#f0f2f8}
    .btn-action.warn{border-color:#ff9800;color:#e65100}
    .btn-action.danger{border-color:#f44336;color:#c62828}
    .pagination{display:flex;align-items:center;gap:16px;padding:16px 20px;border-top:1px solid #f0f2f8;font-size:14px}
    .pagination button{padding:8px 16px;border-radius:10px;border:2px solid #e8ecf4;background:white;cursor:pointer;font-size:13px;transition:all 0.15s}
    .pagination button:hover:not(:disabled){border-color:#e94560;color:#e94560}
    .pagination button:disabled{opacity:0.4;cursor:not-allowed}
    /* ── User Detail Modal ── */
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:2000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
    .modal-lg{background:white;border-radius:24px;padding:32px;width:90%;max-width:800px;max-height:90vh;overflow-y:auto}
    .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
    .modal-header h2{font-size:1.3rem}
    .close-btn{background:none;border:none;font-size:20px;cursor:pointer;color:#6c7293}
    .user-detail-grid{display:grid;grid-template-columns:280px 1fr;gap:24px}
    .ud-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f2f8;font-size:14px}
    .ud-row.highlight{background:#fff5f7;padding:12px;border-radius:8px;border:none;margin:8px 0}
    .ud-row.highlight strong{color:#e94560;font-size:1.2rem}
    .ud-history h4{margin-bottom:12px;font-size:14px;color:#1a1a2e}
    .history-item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f8f9ff;font-size:13px}
    .hi-route{flex:1;font-weight:600}
    .hi-type{color:#6c7293;font-size:12px}
    .hi-amount{color:#e94560;font-weight:700}
    .hi-status{font-size:11px;padding:2px 8px;border-radius:50px;background:#e8f5e9;color:#2e7d32}
    .hs-cancelled{background:#ffebee;color:#c62828}
    .no-data{color:#6c7293;font-size:13px;padding:12px 0}
    /* ── Destinations ── */
    .dest-admin-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;margin-top:20px}
    .dest-admin-card{background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.07)}
    .dest-admin-card img{display:block}
    .dac-body{padding:16px}
    .dac-body h4{font-size:1rem;margin-bottom:4px;color:#1a1a2e}
    .dac-type{font-size:12px;color:#6c7293;margin-bottom:8px}
    .dac-stats{display:flex;gap:12px;font-size:13px;font-weight:600;margin-bottom:12px}
    .dac-actions{display:flex;gap:8px}
    @media(max-width:768px){.admin-sidebar{width:70px;}.admin-main{margin-left:70px}.kpi-grid{grid-template-columns:1fr 1fr}.user-detail-grid{grid-template-columns:1fr}}
  `]
})
export class AdminComponent implements OnInit {
  isAdmin = false;
  logging = false;
  loginError = '';
  loginForm = { email: '', password: '' };
  activeSection = 'dashboard';
  sidebarCollapsed = false;
  currentUser: any = null;

  // Data
  stats: any = null;
  revenueByDest: any[] = [];
  users: any[] = [];
  bookings: any[] = [];
  payments: any[] = [];
  trips: any[] = [];
  adminDestinations: any[] = [];
  selectedUser: any = null;

  // Loading flags
  loadingStats = false; loadingUsers = false;
  loadingBookings = false; loadingPayments = false; loadingTrips = false;

  // Filters & Pagination
  userSearch = ''; userPage = 0;
  bookingStatusFilter = ''; bookingTypeFilter = ''; bookingPage = 0;
  paymentStatusFilter = ''; paymentPage = 0;
  tripDestFilter = ''; tripPage = 0;

  showAddDest = false;
  newDest: any = { name: '', state: '', type: 'BEACH', description: '', imageUrl: '', bestSeason: '', lowBudgetPerDay: 0, midBudgetPerDay: 0, luxuryBudgetPerDay: 0 };

  menu = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'users', icon: '👥', label: 'Users' },
    { key: 'bookings', icon: '🎟', label: 'Bookings' },
    { key: 'payments', icon: '💳', label: 'Payments' },
    { key: 'trips', icon: '✈', label: 'Trip Plans' },
    { key: 'destinations', icon: '🏖', label: 'Destinations' },
  ];

  constructor(private api: ApiService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Check if already logged in as admin
    const user = this.authService.currentUser;
    if (user && user.role === 'ADMIN') {
      this.isAdmin = true; this.currentUser = user;
      this.loadDashboard();
    }
  }

  adminLogin() {
    this.logging = true; this.loginError = '';
    this.authService.login(this.loginForm.email, this.loginForm.password).subscribe({
      next: res => {
        if (res.data.role === 'ADMIN') {
          this.isAdmin = true; this.currentUser = this.authService.currentUser;
          this.loadDashboard();
        } else {
          this.loginError = 'Access denied. Admin credentials required.';
          this.authService.logout();
        }
        this.logging = false;
      },
      error: () => { this.loginError = 'Invalid credentials.'; this.logging = false; }
    });
  }

  loadDashboard() {
    this.loadingStats = true;
    this.api.get<any>('/admin/dashboard').subscribe({
      next: r => { this.stats = r.data; this.loadingStats = false; },
      error: () => this.loadingStats = false
    });
    this.api.get<any[]>('/admin/revenue/by-destination').subscribe({ next: r => this.revenueByDest = r.data || [] });
    this.loadDestinations();
  }

  loadUsers() {
    this.loadingUsers = true;
    const q = this.userSearch ? `&search=${this.userSearch}` : '';
    this.api.get<any>(`/admin/users?page=${this.userPage}&size=20${q}`).subscribe({
      next: r => { this.users = r.data?.content || []; this.loadingUsers = false; },
      error: () => this.loadingUsers = false
    });
  }

  loadBookings() {
    this.loadingBookings = true;
    const s = this.bookingStatusFilter ? `&status=${this.bookingStatusFilter}` : '';
    const t = this.bookingTypeFilter ? `&type=${this.bookingTypeFilter}` : '';
    this.api.get<any>(`/admin/bookings?page=${this.bookingPage}&size=20${s}${t}`).subscribe({
      next: r => { this.bookings = r.data?.content || []; this.loadingBookings = false; },
      error: () => this.loadingBookings = false
    });
  }

  loadPayments() {
    this.loadingPayments = true;
    const s = this.paymentStatusFilter ? `&status=${this.paymentStatusFilter}` : '';
    this.api.get<any>(`/admin/payments?page=${this.paymentPage}&size=20${s}`).subscribe({
      next: r => { this.payments = r.data?.content || []; this.loadingPayments = false; },
      error: () => this.loadingPayments = false
    });
  }

  loadTrips() {
    this.loadingTrips = true;
    const d = this.tripDestFilter ? `&destination=${this.tripDestFilter}` : '';
    this.api.get<any>(`/admin/trips?page=${this.tripPage}&size=20${d}`).subscribe({
      next: r => { this.trips = r.data?.content || []; this.loadingTrips = false; },
      error: () => this.loadingTrips = false
    });
  }

  loadDestinations() {
    this.api.get<any[]>('/destinations').subscribe({ next: r => this.adminDestinations = r.data || [] });
  }

  viewUser(id: number) {
    this.api.get<any>(`/admin/users/${id}`).subscribe({ next: r => this.selectedUser = r.data });
  }

  toggleUser(id: number) {
    if (!confirm('Toggle user status?')) return;
    this.api.put<any>(`/admin/users/${id}/toggle-status`).subscribe({ next: () => this.loadUsers() });
  }

  addDestination() {
    this.api.post<any>('/admin/destinations', this.newDest).subscribe({
      next: () => { this.showAddDest = false; this.loadDestinations(); },
      error: () => {}
    });
  }

  editDest(d: any) { /* open inline editor — left for future */ alert(`Edit ${d.name} — update via PUT /api/admin/destinations/${d.id}`); }
  deleteDest(id: number) {
    if (!confirm('Delete this destination?')) return;
    this.api.delete<any>(`/admin/destinations/${id}`).subscribe({ next: () => this.loadDestinations() });
  }

  getBarWidth(val: number): number {
    const max = Math.max(...this.revenueByDest.map((r: any) => r.revenue));
    return max > 0 ? (val / max) * 100 : 0;
  }

  getIcon(type: string): string { const i: any = {FLIGHT:'✈',TRAIN:'🚂',BUS:'🚌',CAB:'🚕'}; return i[type]||'🎟'; }

  getTitle(): string { return this.menu.find(m => m.key === this.activeSection)?.label || 'Dashboard'; }

  onSectionChange(key: string) {
    this.activeSection = key;
    if (key === 'users' && !this.users.length) this.loadUsers();
    if (key === 'bookings' && !this.bookings.length) this.loadBookings();
    if (key === 'payments' && !this.payments.length) this.loadPayments();
    if (key === 'trips' && !this.trips.length) this.loadTrips();
  }

  logout() { this.authService.logout(); this.isAdmin = false; this.router.navigate(['/']); }
}
