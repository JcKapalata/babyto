import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchatDirect } from './achat-direct';

describe('AchatDirect', () => {
  let component: AchatDirect;
  let fixture: ComponentFixture<AchatDirect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchatDirect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchatDirect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
