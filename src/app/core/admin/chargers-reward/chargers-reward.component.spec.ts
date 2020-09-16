import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ChargersRewardComponent } from "./chargers-reward.component";

describe("ChargersRewardComponent", () => {
  let component: ChargersRewardComponent;
  let fixture: ComponentFixture<ChargersRewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChargersRewardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargersRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
