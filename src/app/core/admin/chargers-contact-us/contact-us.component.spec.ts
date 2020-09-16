import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ChargersContactUsComponent } from "./contact-us.component";

describe("ChargersContactUsComponent", () => {
  let component: ChargersContactUsComponent;
  let fixture: ComponentFixture<ChargersContactUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChargersContactUsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargersContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
