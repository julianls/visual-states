import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelToolsComponent } from './model-tools.component';

describe('ModelToolsComponent', () => {
  let component: ModelToolsComponent;
  let fixture: ComponentFixture<ModelToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
