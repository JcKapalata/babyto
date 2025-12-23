import { UserClientApi } from "../Models/clientUser";

export const USERS: UserClientApi[] = [
  {
    id: 1,
    email: 'admin@monsite.com',
    nom: 'Super Admin',
    password: 'admin123password',
    numero: '+243842345678'
  },
  {
    id: 2,
    email: 'sophie.dev@gmail.com',
    nom: 'Sophie',
    prenom: 'Martin',
    password: 'password456',
    numero: '+243992345678'
  },
  {
    id: 3,
    email: 'contact@lucas.fr',
    password: 'lucaspassword789',
    numero: '+243892245678'
  },
  {
    id: 4,
    email: 'manager@entreprise.com',
    nom: 'Marc Lefebvre',
    password: 'managerSecret!',
    numero: '+243992345678'
  },
  {
    id: 5,
    email: 'test.user@outlook.com',
    nom: 'Utilisateur Test',
    password: 'testpassword000',
    numero: '+243992345338'
  }
];