import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { McPublicationComponent } from "./mc-publication.component";

describe("McPublicationComponent", () => {
  let component: McPublicationComponent;
  let fixture: ComponentFixture<McPublicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [McPublicationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
