import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BakcupSettingsComponent } from './bakcup-settings.component';

describe('BakcupSettingsComponent', () => {
  let component: BakcupSettingsComponent;
  let fixture: ComponentFixture<BakcupSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BakcupSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BakcupSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
