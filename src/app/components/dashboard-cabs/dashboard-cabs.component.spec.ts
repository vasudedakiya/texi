import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCabsComponent } from './dashboard-cabs.component';

describe('DashboardCabsComponent', () => {
  let component: DashboardCabsComponent;
  let fixture: ComponentFixture<DashboardCabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
