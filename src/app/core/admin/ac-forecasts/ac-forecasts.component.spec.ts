import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AcForecastsComponent } from "./ac-forecasts.component";

describe("AcForecastsComponent", () => {
  let component: AcForecastsComponent;
  let fixture: ComponentFixture<AcForecastsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcForecastsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcForecastsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
