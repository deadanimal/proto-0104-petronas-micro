import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ChargersBillAnalyticalComponent } from "./chargers-bill-analytical.component";

describe("ChargersBillAnalyticalComponent", () => {
  let component: ChargersBillAnalyticalComponent;
  let fixture: ComponentFixture<ChargersBillAnalyticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChargersBillAnalyticalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargersBillAnalyticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
