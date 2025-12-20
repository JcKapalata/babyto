import { Routes } from "@angular/router";
import { ViewProfile } from "./view-profile/view-profile";

export const UserRoutes: Routes = [
    { 
      path: 'mon-compte/profil', 
      component: ViewProfile
    }
];