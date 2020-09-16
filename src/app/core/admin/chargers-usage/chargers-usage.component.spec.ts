import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChargersUsageComponent } from "./chargers-usage.component";

describe("ChargersUsageComponent", () => {
  let component: ChargersUsageComponent;
  let fixture: ComponentFixture<ChargersUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChargersUsageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargersUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
