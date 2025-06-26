import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenalesComponent } from './penales.component';

describe('PenalesComponent', () => {
  let component: PenalesComponent;
  let fixture: ComponentFixture<PenalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
