import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrcListComponent } from './prc-list.component';

describe('PrcListComponent', () => {
  let component: PrcListComponent;
  let fixture: ComponentFixture<PrcListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrcListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
