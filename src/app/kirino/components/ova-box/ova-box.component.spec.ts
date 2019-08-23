import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvaBoxComponent } from './ova-box.component';

describe('OvaBoxComponent', () => {
  let component: OvaBoxComponent;
  let fixture: ComponentFixture<OvaBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvaBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvaBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
