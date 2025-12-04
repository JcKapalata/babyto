import { Component, OnInit } from '@angular/core';
import { Produit } from '../../Models/produits';
import { ActivatedRoute, Router } from '@angular/router';
import { AchatService } from '../achat-service';
import { MatIcon, MatIconModule,  } from "@angular/material/icon";
import { AchatForm } from "../achat-form/achat-form";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-achat-direct',
  imports: [ AchatForm, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './achat-direct.html',
  styleUrl: './achat-direct.css',
})
export class AchatDirect implements OnInit {

  produit: Produit;

  constructor(
    private route: ActivatedRoute,
    private achatService: AchatService,
    private router: Router
  ){}

  ngOnInit(): void {
    const produitId: string | null = this.route.snapshot.paramMap.get('id');
    if (produitId) {
      this.achatService.getProduitById(+produitId).subscribe(prod => {
        if (prod) {
          this.produit = prod;
        }
      });
    }
  }

  goBack(){
    this.router.navigate(['boutique/produits-list']);
  }
}
