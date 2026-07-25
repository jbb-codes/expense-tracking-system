import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { routes } from './app.routes';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getUsername',
      'logout',
    ]);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('when not authenticated', () => {
    beforeEach(() => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should not render the sidebar or topbar shell', () => {
      expect(fixture.nativeElement.querySelector('.sidebar')).toBeNull();
      expect(fixture.nativeElement.querySelector('.topbar')).toBeNull();
    });
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.getUsername.and.returnValue('Emily');
      fixture.detectChanges();
    });

    it('should render sidebar links limited to Dashboard, Expenses, Categories', () => {
      const links = Array.from(
        fixture.nativeElement.querySelectorAll('.sidebar__link'),
      ).map((a: any) => a.textContent.trim().replace(/\s+/g, ' '));

      expect(links.length).toBe(3);
      expect(links[0]).toContain('Dashboard');
      expect(links[1]).toContain('Expenses');
      expect(links[2]).toContain('Categories');
    });

    it('should show the welcome greeting with the username', () => {
      const topbarRight = fixture.nativeElement.querySelector('.topbar__right');
      expect(topbarRight.textContent).toContain('Welcome, Emily!');
    });

    it('should keep the nav closed by default and hide the sidebar', () => {
      const shell = fixture.nativeElement.querySelector('.shell');
      expect(shell.classList.contains('shell--nav-closed')).toBeTrue();
    });

    it('should toggle the nav open and closed using a single button element', () => {
      const toggleButtons = () =>
        fixture.nativeElement.querySelectorAll('.shell__toggle');

      expect(toggleButtons().length).toBe(1);

      toggleButtons()[0].click();
      fixture.detectChanges();

      const shell = fixture.nativeElement.querySelector('.shell');
      expect(shell.classList.contains('shell--nav-closed')).toBeFalse();
      expect(toggleButtons().length).toBe(1);

      toggleButtons()[0].click();
      fixture.detectChanges();
      expect(shell.classList.contains('shell--nav-closed')).toBeTrue();
    });

    it('should keep the user menu popover closed until the avatar is clicked', () => {
      expect(
        fixture.nativeElement.querySelector('.user-menu__popover'),
      ).toBeNull();

      fixture.nativeElement.querySelector('.user-menu__avatar').click();
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.user-menu__popover'),
      ).not.toBeNull();
    });

    it('should log out, close the user menu, and navigate to /login when Sign Out is clicked', () => {
      const navigateSpy = spyOn(router, 'navigate');

      fixture.nativeElement.querySelector('.user-menu__avatar').click();
      fixture.detectChanges();

      fixture.nativeElement.querySelector('.user-menu__signout').click();
      fixture.detectChanges();

      expect(authServiceSpy.logout).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
      expect(
        fixture.nativeElement.querySelector('.user-menu__popover'),
      ).toBeNull();
    });
  });
});
