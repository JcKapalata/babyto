export interface UserClientApi {
  id: number;
  email: string;
  numero?: string;
  nom?: string;
  prenom?: string;   
  password: string;
  token?: string;  
}