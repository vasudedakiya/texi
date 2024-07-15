import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTripHistoryComponent } from './dashboard-trip-history.component';

describe('DashboardTripHistoryComponent', () => {
  let component: DashboardTripHistoryComponent;
  let fixture: ComponentFixture<DashboardTripHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTripHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTripHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
