import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerFreeComponent } from './consumer-free.component';

describe('ConsumerFreeComponent', () => {
  let component: ConsumerFreeComponent;
  let fixture: ComponentFixture<ConsumerFreeComponent>;

  beforeEach(async(() => {
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
