import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the nav closed by default with only the open button visible', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('[data-testid="main-nav"]');
    const openButton = fixture.nativeElement.querySelector(
      '[data-testid="nav-open-button"]',
    );
    const closeButton = fixture.nativeElement.querySelector(
      '[data-testid="nav-close-button"]',
    );
    const navLink = fixture.nativeElement.querySelector(
      '[data-testid="main-nav"] a',
    );

    expect(nav.classList.contains('nav--open')).toBeFalse();
    expect(openButton).not.toBeNull();
    expect(closeButton).toBeNull();
    expect(navLink).toBeNull();
  });

  it('should open the nav and mount the close button and links together when the open button is clicked', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const openButton = fixture.nativeElement.querySelector(
      '[data-testid="nav-open-button"]',
    );
    openButton.click();
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('[data-testid="main-nav"]');
    const closeButton = fixture.nativeElement.querySelector(
      '[data-testid="nav-close-button"]',
    );
    const navLink = fixture.nativeElement.querySelector(
      '[data-testid="main-nav"] a',
    );

    expect(nav.classList.contains('nav--open')).toBeTrue();
    expect(closeButton).not.toBeNull();
    expect(navLink).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('[data-testid="nav-open-button"]'),
    ).toBeNull();
  });

  it('should close the nav and unmount the close button and links together when the close button is clicked', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    fixture.nativeElement
      .querySelector('[data-testid="nav-open-button"]')
      .click();
    fixture.detectChanges();

    fixture.nativeElement
      .querySelector('[data-testid="nav-close-button"]')
      .click();
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('[data-testid="main-nav"]');
    const openButton = fixture.nativeElement.querySelector(
      '[data-testid="nav-open-button"]',
    );
    const closeButton = fixture.nativeElement.querySelector(
      '[data-testid="nav-close-button"]',
    );
    const navLink = fixture.nativeElement.querySelector(
      '[data-testid="main-nav"] a',
    );

    expect(nav.classList.contains('nav--open')).toBeFalse();
    expect(openButton).not.toBeNull();
    expect(closeButton).toBeNull();
    expect(navLink).toBeNull();
  });

  it('should place the close button inside the nav element', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    fixture.nativeElement
      .querySelector('[data-testid="nav-open-button"]')
      .click();
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('[data-testid="main-nav"]');
    const closeButton = nav.querySelector('[data-testid="nav-close-button"]');

    expect(closeButton).not.toBeNull();
  });
});
