import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KampfToolComponent } from './kampf-tool.component';

describe('KampfToolComponent', () => {
  let component: KampfToolComponent;
  let fixture: ComponentFixture<KampfToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KampfToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KampfToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
