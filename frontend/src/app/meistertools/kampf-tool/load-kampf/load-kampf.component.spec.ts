import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadKampfComponent } from './load-kampf.component';

describe('LoadKampfComponent', () => {
  let component: LoadKampfComponent;
  let fixture: ComponentFixture<LoadKampfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadKampfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadKampfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
