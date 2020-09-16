import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AcClimateComponent } from "./ac-climate.component";

describe("AcClimateComponent", () => {
  let component: AcClimateComponent;
  let fixture: ComponentFixture<AcClimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcClimateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcClimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
