/**
 * Author: Kaitlyn Kelly
 * Week 7 - Sprint 2
 * File: delete-expense.component.spec.ts
 * Description: Unit tests for DeleteExpenseComponent
 **/

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteExpenseComponent } from './delete-expense.component';

describe('DeleteExpenseComponent', () => {
  let component: DeleteExpenseComponent;
  let fixture: ComponentFixture<DeleteExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
