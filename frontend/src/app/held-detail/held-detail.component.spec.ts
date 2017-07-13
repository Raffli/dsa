import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeldDetailComponent } from './held-detail.component';

describe('HeldDetailComponent', () => {
  let component: HeldDetailComponent;
  let fixture: ComponentFixture<HeldDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeldDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeldDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
