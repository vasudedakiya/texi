import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGeneratedInvoiceComponent } from './dashboard-generated-invoice.component';

describe('DashboardGeneratedInvoiceComponent', () => {
  let component: DashboardGeneratedInvoiceComponent;
  let fixture: ComponentFixture<DashboardGeneratedInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardGeneratedInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardGeneratedInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
