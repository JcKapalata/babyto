import { UserClient } from "../Models/clientUser";

export const USERS: UserClient[] = [
  {
    id: 1,
    email: 'admin@monsite.com',
    nom: 'Super Admin',
    password: 'admin123password',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Token simulé
    lastSessionTag: ''
  },
  {
    id: 2,
    email: 'sophie.dev@gmail.com',
    nom: 'Sophie Martin',
    password: 'password456',
    token: 'abc123def456',
    lastSessionTag: ''
  },
  {
    id: 3,
    email: 'contact@lucas.fr',
    // nom est optionnel, donc on peut l'omettre ici
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