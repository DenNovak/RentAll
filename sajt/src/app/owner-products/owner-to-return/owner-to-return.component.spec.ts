import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnerToReturnComponent } from './owner-to-return.component';

describe('OwnerToReturnComponent', () => {
  let component: OwnerToReturnComponent;
  let fixture: ComponentFixture<OwnerToReturnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerToReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerToReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
