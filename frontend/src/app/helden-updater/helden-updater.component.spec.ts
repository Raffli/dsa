import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeldenUpdaterComponent } from './helden-updater.component';

describe('HeldenUpdaterComponent', () => {
  let component: HeldenUpdaterComponent;
  let fixture: ComponentFixture<HeldenUpdaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeldenUpdaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeldenUpdaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
