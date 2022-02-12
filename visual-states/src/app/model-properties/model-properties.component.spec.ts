import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModelPropertiesComponent } from './model-properties.component';

describe('ModelPropertiesComponent', () => {
  let component: ModelPropertiesComponent;
  let fixture: ComponentFixture<ModelPropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
