import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Victory } from './victory';

describe('Victory', () => {
  let component: Victory;
  let fixture: ComponentFixture<Victory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Victory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Victory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
