import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ChargersBillSummaryComponent } from "./chargers-bill-summary.component";

describe("ChargersBillSummaryComponent", () => {
  let component: ChargersBillSummaryComponent;
  let fixture: ComponentFixture<ChargersBillSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChargersBillSummaryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargersBillSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
