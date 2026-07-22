import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';

import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the header and tagline', () => {
    const compiled: HTMLElement = fixture.nativeElement;

    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Expense Tracking System',
    );
    expect(compiled.querySelector('.landing__tagline')?.textContent).toContain(
      'Track spending, organize it by category, and see where your money goes.',
    );
  });

  it('should route the Sign In button to /login', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const signInLink = compiled.querySelector(
      'a[routerLink="/login"]',
    ) as HTMLAnchorElement;

    expect(signInLink).toBeTruthy();
    expect(signInLink.textContent).toContain('Sign In');
  });

  it('should route the Register button to /register', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const registerLink = compiled.querySelector(
      'a[routerLink="/register"]',
    ) as HTMLAnchorElement;

    expect(registerLink).toBeTruthy();
    expect(registerLink.textContent).toContain('Register');
  });

  it('should navigate to /login when the Sign In button is clicked', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const compiled: HTMLElement = fixture.nativeElement;
    const signInLink = compiled.querySelector(
      'a[routerLink="/login"]',
    ) as HTMLAnchorElement;

    signInLink.click();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalled();
  });
});
