import { Component } from '@angular/core';
import { MatIconModule} from '@angular/material/icon';

import { Router } from '@angular/router';
@Component({
  selector: 'app-footer',
  imports: [MatIconModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer {

  constructor(
    private router: Router
  ){}

  goToCGV() {
    this.router.navigate(['conditions-generales-ventes'])
  }

  goToPolitiqueRetour() {
    this.router.navigate(['politique-retour'])
  }

  goToConfidentialite() {
    this.router.navigate(['politique-confidentialite'])
  }

  goToApropos() {
    this.router.navigate(['a-propos'])
  }


}

