import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappRedirect } from './whatsapp-redirect';

describe('WhatsappRedirect', () => {
  let component: WhatsappRedirect;
  let fixture: ComponentFixture<WhatsappRedirect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappRedirect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappRedirect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
