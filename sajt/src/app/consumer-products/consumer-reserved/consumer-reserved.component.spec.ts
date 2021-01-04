import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsumerReservedComponent } from './consumer-reserved.component';

describe('ConsumerReservedComponent', () => {
  let component: ConsumerReservedComponent;
  let fixture: ComponentFixture<ConsumerReservedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerReservedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerReservedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
