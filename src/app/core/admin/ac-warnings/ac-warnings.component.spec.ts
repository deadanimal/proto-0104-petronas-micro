import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AcWarningsComponent } from "./ac-warnings.component";

describe("AcWarningsComponent", () => {
  let component: AcWarningsComponent;
  let fixture: ComponentFixture<AcWarningsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcWarningsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcWarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
