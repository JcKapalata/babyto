import { UserClientApi } from "../Models/clientUser";

export const USERS: UserClientApi[] = [
  {
    id: 1,
    email: 'admin@monsite.com',
    nom: 'Super Admin',
    password: 'admin123password',
  },
  {
    id: 2,
    email: 'sophie.dev@gmail.com',
    nom: 'Sophie',
    prenom: 'Martin',
    password: 'password456',
  },
  {
    id: 3,
    email: 'contact@lucas.fr',
    password: 'lucaspassword789',
    lastSessionTag: ''
  },
  {
    id: 4,
    email: 'manager@entreprise.com',
    nom: 'Marc Lefebvre',
    password: 'managerSecret!',
    lastSessionTag: ''
  },
  {
    id: 5,
    email: 'test.user@outlook.com',
    nom: 'Utilisateur Test',
    password: 'testpassword000'
  }
];