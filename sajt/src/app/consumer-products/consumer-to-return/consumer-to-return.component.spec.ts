import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerToReturnComponent } from './consumer-to-return.component';

describe('ConsumerToReturnComponent', () => {
  let component: ConsumerToReturnComponent;
  let fixture: ComponentFixture<ConsumerToReturnComponent>;

  beforeEach(async(() => {
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
