import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayKampfComponent } from './display-kampf.component';

describe('DisplayKampfComponent', () => {
  let component: DisplayKampfComponent;
  let fixture: ComponentFixture<DisplayKampfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayKampfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayKampfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
