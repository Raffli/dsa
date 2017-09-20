import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveKampfteilnehmerComponent } from './save-kampfteilnehmer.component';

describe('SaveKampfteilnehmerComponent', () => {
  let component: SaveKampfteilnehmerComponent;
  let fixture: ComponentFixture<SaveKampfteilnehmerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveKampfteilnehmerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveKampfteilnehmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
