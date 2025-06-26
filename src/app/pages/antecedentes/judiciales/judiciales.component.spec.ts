import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JudicialesComponent } from './judiciales.component';

describe('JudicialesComponent', () => {
  let component: JudicialesComponent;
  let fixture: ComponentFixture<JudicialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JudicialesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JudicialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
