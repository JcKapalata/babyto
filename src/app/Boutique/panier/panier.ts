import { Component, OnInit } from '@angular/core';
import { PanierService } from '../panier-service';
import { CommandeItem } from '../../Models/commande';
import { CommonModule, CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-panier',
  imports: [CommonModule, CurrencyPipe ],
  templateUrl: './panier.html',
  styleUrls: ['./panier.css']
})
export class Panier implements OnInit {
  items: CommandeItem[] = [];

  constructor(private panierService: PanierService) {}

  ngOnInit() {
    this.panierService.items$.subscribe(items => {
      this.items = items;
    });
  }

  increment(item: CommandeItem) {
    item.quantity++;
    this.panierService.updateItems(this.items);
  }

  decrement(item: CommandeItem) {
    if (item.quantity > 1) {
      item.quantity--;
      this.panierService.updateItems(this.items);
    }
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.getTotal(), 0);
  }

  supprimer(item: CommandeItem) {
    this.items = this.items.filter(i => i !== item);
    this.panierService.updateItems(this.items);
  }
}
