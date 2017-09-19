import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayKampfMemberComponent } from './display-kampf-member.component';

describe('DisplayKampfMemberComponent', () => {
  let component: DisplayKampfMemberComponent;
  let fixture: ComponentFixture<DisplayKampfMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayKampfMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayKampfMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
