import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateKampfComponent } from './create-kampf.component';

describe('CreateKampfComponent', () => {
  let component: CreateKampfComponent;
  let fixture: ComponentFixture<CreateKampfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateKampfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateKampfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
