
export interface UserClientApi {
  id: number;
  email: string;
  nom?: string;
  prenom?: string;   
  password?: string;
  token?: string; 
  lastSessionTag?: string;  
}

export interface UserClientProfile{
  id: number;
  email: string;
  nom?: string;
  prenom?: string;
  lastSessionTag?: string;
}