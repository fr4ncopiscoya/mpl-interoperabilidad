import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicialesComponent } from './policiales.component';

describe('PolicialesComponent', () => {
  let component: PolicialesComponent;
  let fixture: ComponentFixture<PolicialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicialesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
