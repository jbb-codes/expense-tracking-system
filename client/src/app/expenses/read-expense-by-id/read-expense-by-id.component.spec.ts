import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadExpenseByIdComponent } from './read-expense-by-id.component';

describe('ReadExpenseByIdComponent', () => {
  let component: ReadExpenseByIdComponent;
  let fixture: ComponentFixture<ReadExpenseByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadExpenseByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadExpenseByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
