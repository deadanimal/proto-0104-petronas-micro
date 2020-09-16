import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PreviousBillSummaryComponent } from "./previous-bill-summary.component";

describe("PreviousBillSummaryComponent", () => {
  let component: PreviousBillSummaryComponent;
  let fixture: ComponentFixture<PreviousBillSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreviousBillSummaryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousBillSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
