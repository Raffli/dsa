import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KampfbogenComponent } from './kampfbogen.component';

describe('KampfbogenComponent', () => {
  let component: KampfbogenComponent;
  let fixture: ComponentFixture<KampfbogenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KampfbogenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KampfbogenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
