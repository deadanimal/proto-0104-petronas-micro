import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { McEducationComponent } from "./mc-education.component";

describe("McEducationComponent", () => {
  let component: McEducationComponent;
  let fixture: ComponentFixture<McEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [McEducationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
