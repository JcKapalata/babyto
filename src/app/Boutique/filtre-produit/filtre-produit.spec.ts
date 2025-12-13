import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltreProduit } from './filtre-produit';

describe('FiltreProduit', () => {
  let component: FiltreProduit;
  let fixture: ComponentFixture<FiltreProduit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltreProduit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltreProduit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
