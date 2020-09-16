import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AcSatelliteAndRadarComponent } from "./ac-satellite-and-radar.component";

describe("AcSatelliteAndRadarComponent", () => {
  let component: AcSatelliteAndRadarComponent;
  let fixture: ComponentFixture<AcSatelliteAndRadarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcSatelliteAndRadarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcSatelliteAndRadarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
