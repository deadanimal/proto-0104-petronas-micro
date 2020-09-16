import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { McCommAndCorpComponent } from "./mc-comm-and-corp.component";

describe("McCommAndCorpComponent", () => {
  let component: McCommAndCorpComponent;
  let fixture: ComponentFixture<McCommAndCorpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [McCommAndCorpComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McCommAndCorpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
