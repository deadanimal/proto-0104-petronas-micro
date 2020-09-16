import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ChargersBillPresentmentComponent } from "./chargers-bill-presentment.component";

describe("ChargersBillPresentmentComponent", () => {
  let component: ChargersBillPresentmentComponent;
  let fixture: ComponentFixture<ChargersBillPresentmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChargersBillPresentmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargersBillPresentmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
