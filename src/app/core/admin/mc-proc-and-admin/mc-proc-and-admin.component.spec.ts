import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { McProcAndAdminComponent } from "./mc-proc-and-admin.component";

describe("McProcAndAdminComponent", () => {
  let component: McProcAndAdminComponent;
  let fixture: ComponentFixture<McProcAndAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [McProcAndAdminComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McProcAndAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
