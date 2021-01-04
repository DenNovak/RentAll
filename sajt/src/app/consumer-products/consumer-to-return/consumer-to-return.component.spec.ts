import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsumerToReturnComponent } from './consumer-to-return.component';

describe('ConsumerToReturnComponent', () => {
  let component: ConsumerToReturnComponent;
  let fixture: ComponentFixture<ConsumerToReturnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerToReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerToReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
