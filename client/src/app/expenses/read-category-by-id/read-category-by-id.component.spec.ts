import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadCategoryByIdComponent } from './read-category-by-id.component';

describe('ReadCategoryByIdComponent', () => {
  let component: ReadCategoryByIdComponent;
  let fixture: ComponentFixture<ReadCategoryByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadCategoryByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadCategoryByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
