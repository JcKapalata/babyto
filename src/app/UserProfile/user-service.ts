import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '../authentification/auth-service';
import { UserClientProfile } from '../Models/clientProfile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authService = inject(AuthService);

  /**
   * SIGNAL CALCULÉ SÉCURISÉ
   * Ce signal suit l'état de 'authService.user()' mais ne renvoie
   * que les propriétés définies dans l'interface UserClientProfile.
   */
  public readonly currentProfile = computed<UserClientProfile | null>(() => {
    const u = this.authService.user();
    
    // Si l'utilisateur n'est pas connecté
    if (!u) return null;
    
    // On extrait uniquement les données non sensibles
    const profile: UserClientProfile = {
      id: u.id,
      email: u.email,
      nom: u.nom,
      prenom: u.prenom,
      lastSessionTag: u.lastSessionTag
    };

    console.log('[UserService] Profil sécurisé mis à jour');
    return profile;
  });

  /**
   * Version simplifiée pour afficher uniquement le nom complet
   */
  public readonly displayName = computed(() => {
    const profile = this.currentProfile();
    return profile ? `${profile.prenom} ${profile.nom}` : 'Invité';
  });
}
