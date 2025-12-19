export interface UserClient {
  id: number;
  email: string;
  nom?: string;   
  password?: string;
  token?: string; 
  lastSessionTag?: string;  
}