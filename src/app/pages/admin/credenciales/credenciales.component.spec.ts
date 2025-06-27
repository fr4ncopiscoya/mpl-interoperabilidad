import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredencialesComponent } from './credenciales.component';

describe('CredencialesComponent', () => {
  let component: CredencialesComponent;
  let fixture: ComponentFixture<CredencialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredencialesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredencialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
