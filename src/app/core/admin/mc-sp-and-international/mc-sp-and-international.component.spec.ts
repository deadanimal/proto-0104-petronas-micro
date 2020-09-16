import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { McSpAndInternationalComponent } from "./mc-sp-and-international.component";

describe("McSpAndInternationalComponent", () => {
  let component: McSpAndInternationalComponent;
  let fixture: ComponentFixture<McSpAndInternationalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [McSpAndInternationalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McSpAndInternationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
