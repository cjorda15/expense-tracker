import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonThemeToggleComponent } from './button-theme-toggle.component';

describe('ButtonThemeToggleComponent', () => {
  let component: ButtonThemeToggleComponent;
  let fixture: ComponentFixture<ButtonThemeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonThemeToggleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
