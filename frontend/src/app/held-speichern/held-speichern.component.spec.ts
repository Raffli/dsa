import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeldSpeichernComponent } from './held-speichern.component';

describe('HeldSpeichernComponent', () => {
  let component: HeldSpeichernComponent;
  let fixture: ComponentFixture<HeldSpeichernComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeldSpeichernComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeldSpeichernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
