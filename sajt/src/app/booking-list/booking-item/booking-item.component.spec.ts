import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BookingItemComponent } from './booking-item.component';

describe('BookingItemComponent', () => {
  let component: BookingItemComponent;
  let fixture: ComponentFixture<BookingItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
