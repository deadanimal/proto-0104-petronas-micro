import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AcEarthquakeNTsunamiComponent } from "./ac-earthquake-n-tsunami.component";

describe("AcEarthquakeNTsunamiComponent", () => {
  let component: AcEarthquakeNTsunamiComponent;
  let fixture: ComponentFixture<AcEarthquakeNTsunamiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcEarthquakeNTsunamiComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcEarthquakeNTsunamiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
