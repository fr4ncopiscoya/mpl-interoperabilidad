import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuneduComponent } from './sunedu.component';

describe('SuneduComponent', () => {
  let component: SuneduComponent;
  let fixture: ComponentFixture<SuneduComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuneduComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuneduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
