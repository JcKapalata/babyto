import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitDetail } from './produit-detail';

describe('ProduitDetail', () => {
  let component: ProduitDetail;
  let fixture: ComponentFixture<ProduitDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduitDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
