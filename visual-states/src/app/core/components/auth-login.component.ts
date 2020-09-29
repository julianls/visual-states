import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-login',
  template: ` <a mat-list-item (click)="goAuth()">{{ provider }}</a> `,
})
export class AuthLoginComponent {
  @Input() provider = '';

  goAuth(): void {
    const { pathname } = window.location;
    const redirect = `post_login_redirect_uri=${pathname}`;
    const url = `/.auth/login/${this.provider}?${redirect}`;
    window.location.href = url;
  }
}
