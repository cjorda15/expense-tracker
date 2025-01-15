import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Signal,
  computed,
  inject
} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ButtonComponent } from '../button/button.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { UserStore } from '@store/user';
import { User } from '@store/user.model';

@Component({
  selector: 'app-button-auth',
  imports: [ButtonComponent, CommonModule],
  templateUrl: './button-auth.component.html',
  styleUrl: './button-auth.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonAuthComponent implements OnInit, OnDestroy {
  public isAuthenticated: boolean = false;
  public destroy$ = new Subject();
  public userStore = inject(UserStore);
  public userReady: Signal<boolean> = computed(
    () => this.userStore.state() === 'ready'
  );
  constructor(
    public auth: AuthService,
    @Inject(DOCUMENT) public document: Document
  ) {}
  ngOnInit(): void {
    this.auth.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.isAuthenticated = response;
        response ? this.setUserDetails() : this.userStore.clear();
      });
  }

  setUserDetails() {
    this.auth.user$.subscribe((loggedinUser) => {
      if (loggedinUser) {
        const user: User = {
          givenName: loggedinUser.given_name || '',
          familyName: loggedinUser.family_name || '',
          email: loggedinUser.email || ''
        };

        this.userStore.login(user);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
