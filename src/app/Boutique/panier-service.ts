import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommandeItem } from '../Models/commande';

@Injectable({
  providedIn: 'root'
})
export class PanierService {

  private showPanierSubject = new BehaviorSubject<boolean>(false);
  showPanier$ = this.showPanierSubject.asObservable();

  private itemsSubject = new BehaviorSubject<CommandeItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  // Ajouter un produit
  ajouterProduit(item: CommandeItem) {
    const currentItems = this.itemsSubject.value;

    const existing = currentItems.find(p => p.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      currentItems.push(item);
    }

    this.itemsSubject.next([...currentItems]);
  }

  updateItems(items: CommandeItem[]) {
    this.itemsSubject.next([...items]);
  }

  viderPanier() {
    this.itemsSubject.next([]);
  }

  togglePanier() {
    this.showPanierSubject.next(!this.showPanierSubject.value);   
  }
}
