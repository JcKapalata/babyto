import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produit } from '../Models/produits';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { GroupeProduits } from '../Models/groupeProduits';

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {
  
  constructor(
    private http: HttpClient,
  ){}

  getProduitsList(): Observable<GroupeProduits> {
    return this.http.get<Produit[]>('api/produits').pipe(
      tap( () => console.log('Produits bruts reçus.')),
      
      map(produitList => this.grouperParClassement(produitList)),
      
      tap( (groupedList) => console.table(groupedList)),

      catchError( error => {
        console.error('Erreur lors de la récupération des produits:', error);
        // En cas d'erreur, retourner un Observable d'un objet vide
        return of({}); 
      })
    );
  }

  // Méthode de regroupement (la même que celle définie dans votre question précédente)
  private grouperParClassement(produits: Produit[]): GroupeProduits {
    return produits.reduce((acc, produit) => {
      const classement = produit.classement;
      
      if (!acc[classement]) {
        acc[classement] = [];
      }
      
      acc[classement].push(produit);
      return acc;
    }, {} as GroupeProduits); 
  }

  // getProduitsList(): Observable<Produit[]>{
  //   return this.http.get<Produit[]>('api/produits').pipe(
  //     tap( (produitList) => console.table(produitList)),
  //     catchError( error =>{
  //       console.log(error)
  //       return of([])
  //     })
  //   )
  // }

  getProduitById(produitId: number): Observable<Produit | undefined>{
    return this.http.get<Produit>(`api/produits/${produitId}`).pipe(
      tap( (produit) => console.log(produit)),
      catchError( error =>{
        console.log(error)
        return of(undefined)
      })
    )
  }
}
