import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../model';

@Component({
  selector: 'app-nav',
  template: `
    <mat-nav-list>
      <ng-container *ngIf="!userInfo">
        <ng-container *ngFor="let provider of providers">
          <app-auth-login [provider]="provider"></app-auth-login>
        </ng-container>
      </ng-container>
      <app-auth-logout *ngIf="userInfo"></app-auth-logout>
    </mat-nav-list>
    <div class="user" *ngIf="userInfo">
      <p>Welcome</p>
      <p>{{ userInfo?.userDetails }}</p>
      <p>{{ userInfo?.identityProvider }}</p>
    </div>
  `,
})
export class NavComponent implements OnInit {
  providers = ['twitter', 'github', 'aad', 'google', 'facebook'];
  userInfo: UserInfo;

  // tslint:disable-next-line:typedef
  async ngOnInit() {
    this.userInfo = await this.getUserInfo();
  }

  async getUserInfo(): Promise<UserInfo> {
    try {
      const response = await fetch('/.auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;
      return clientPrincipal;
    } catch (error) {
      console.error('No profile could be found');
      return undefined;
    }
  }
}
