import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadKampfMemberComponent } from './load-kampf-member.component';

describe('LoadKampfMemberComponent', () => {
  let component: LoadKampfMemberComponent;
  let fixture: ComponentFixture<LoadKampfMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadKampfMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadKampfMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
