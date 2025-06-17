import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CextranjeriaComponent } from './cextranjeria.component';

describe('CextranjeriaComponent', () => {
  let component: CextranjeriaComponent;
  let fixture: ComponentFixture<CextranjeriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CextranjeriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CextranjeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
