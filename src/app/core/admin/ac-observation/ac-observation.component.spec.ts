import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AcObservationComponent } from "./ac-observation.component";

describe("AcObservationComponent", () => {
  let component: AcObservationComponent;
  let fixture: ComponentFixture<AcObservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcObservationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
