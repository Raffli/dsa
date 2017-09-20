import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveKampfComponent } from './save-kampf.component';

describe('SaveKampfComponent', () => {
  let component: SaveKampfComponent;
  let fixture: ComponentFixture<SaveKampfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveKampfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveKampfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
