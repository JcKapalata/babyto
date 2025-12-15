import { HttpClient, HttpParams } from '@angular/common/http';
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

  // recupere tout le produit
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

  // Méthode de regroupement de produit
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

  // methode pour search
  searchProduit(term: string): Observable<Produit[]>{

    // 1. Gérer les termes vides : Si le terme est vide ou juste des espaces, ne pas appeler l'API.
    if (!term.trim()) {
      return of([]);
    }

    // 2. Construire les paramètres HTTP de manière standard
    const params = new HttpParams().set('nom', term.trim());

    return this.http.get<Produit[]>('api/produits/', {params: params}).pipe(
      tap(data => console.log(`API a retourné ${data.length} produits pour le terme: ${term}`)),

      catchError( error => {
        console.error('Erreur lors de la récupération des produits:', error);
        // En cas d'erreur, retourner un Observable d'un objet vide
        return of([]); 
      })
    )
  }
  
  // recupere le produit par id
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
