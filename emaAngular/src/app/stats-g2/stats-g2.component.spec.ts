import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsG2Component } from './stats-g2.component';

describe('StatsG2Component', () => {
  let component: StatsG2Component;
  let fixture: ComponentFixture<StatsG2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatsG2Component]
    });
    fixture = TestBed.createComponent(StatsG2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
