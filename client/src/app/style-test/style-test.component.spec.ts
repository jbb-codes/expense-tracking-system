import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleTestComponent } from './style-test.component';

describe('StyleTestComponent', () => {
  let component: StyleTestComponent;
  let fixture: ComponentFixture<StyleTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StyleTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StyleTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
