import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the header and tagline', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain(
      'Expense Tracking System',
    );
    expect(el.textContent).toContain(
      'Track spending, organize it by category, and see where your money goes.',
    );
  });

  it('navigates to /login when Sign In is clicked', () => {
    const el: HTMLElement = fixture.nativeElement;
    const signInButton = Array.from(el.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Sign In',
    );

    signInButton?.click();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('navigates to /register when Register is clicked', () => {
    const el: HTMLElement = fixture.nativeElement;
    const registerButton = Array.from(el.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Register',
    );

    registerButton?.click();

    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });
});
