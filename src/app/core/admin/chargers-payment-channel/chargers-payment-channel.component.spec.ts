import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ChargersPaymentChannelComponent } from "./chargers-payment-channel.component";

describe("ChargersPaymentChannelComponent", () => {
  let component: ChargersPaymentChannelComponent;
  let fixture: ComponentFixture<ChargersPaymentChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChargersPaymentChannelComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargersPaymentChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
