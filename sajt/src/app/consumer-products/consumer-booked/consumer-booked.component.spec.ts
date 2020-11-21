import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerBookedComponent } from './consumer-booked.component';

describe('ConsumerBookedComponent', () => {
  let component: ConsumerBookedComponent;
  let fixture: ComponentFixture<ConsumerBookedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerBookedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerBookedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
