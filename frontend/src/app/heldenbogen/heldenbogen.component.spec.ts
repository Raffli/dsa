import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeldenbogenComponent } from './heldenbogen.component';

describe('HeldenbogenComponent', () => {
  let component: HeldenbogenComponent;
  let fixture: ComponentFixture<HeldenbogenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeldenbogenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeldenbogenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
