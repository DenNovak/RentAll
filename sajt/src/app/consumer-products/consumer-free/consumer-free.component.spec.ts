import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsumerFreeComponent } from './consumer-free.component';

describe('ConsumerFreeComponent', () => {
  let component: ConsumerFreeComponent;
  let fixture: ComponentFixture<ConsumerFreeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerFreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
