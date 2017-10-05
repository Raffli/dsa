import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeldLadenPasswortComponent } from './held-laden-passwort.component';

describe('HeldLadenPasswortComponent', () => {
  let component: HeldLadenPasswortComponent;
  let fixture: ComponentFixture<HeldLadenPasswortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeldLadenPasswortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeldLadenPasswortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
