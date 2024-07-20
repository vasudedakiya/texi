import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadJourneyDetailsComponent } from './download-journey-details.component';

describe('DownloadJourneyDetailsComponent', () => {
  let component: DownloadJourneyDetailsComponent;
  let fixture: ComponentFixture<DownloadJourneyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadJourneyDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadJourneyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
