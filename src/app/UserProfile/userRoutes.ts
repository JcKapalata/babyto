import { Routes } from "@angular/router";
import { ViewProfile } from "./view-profile/view-profile";
import { authGuard } from "../authentification/auth-guard";

export const UserRoutes: Routes = [
    { 
      path: 'mon-compte/profil', 
      component: ViewProfile,
      canActivate:[authGuard]
    }
];