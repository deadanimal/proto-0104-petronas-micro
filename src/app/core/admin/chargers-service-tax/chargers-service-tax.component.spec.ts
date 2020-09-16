import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargersServiceTaxComponent } from './chargers-service-tax.component';

describe('ChargersServiceTaxComponent', () => {
  let component: ChargersServiceTaxComponent;
  let fixture: ComponentFixture<ChargersServiceTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargersServiceTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargersServiceTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
