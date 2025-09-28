import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// URL di base dell'API (Render aggiunge l'URL del dominio)
// *** SOSTITUISCI QUESTO URL CON L'URL DEL TUO SERVIZIO BACKEND SU RENDER ***
const API_BASE_URL = 'https://my-project-api.onrender.com'; 

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // Recupera tutti gli utenti
  getUtenti(): Observable<any[]> {
    // Usa il percorso Backend corretto: /api/utenti
    return this.http.get<any[]>(`${API_BASE_URL}/api/utenti`);
  }

  // Aggiunge un nuovo utente. Payload si aspetta { nome: string }
  addUtente(data: { nome: string }): Observable<any> {
    // Usa il percorso Backend corretto: /api/utenti
    return this.http.post<any>(`${API_BASE_URL}/api/utenti`, data);
  }

  // Elimina un utente per ID
  deleteUtente(id: number): Observable<any> {
    // Usa il percorso Backend corretto: /api/utenti/:id
    return this.http.delete<any>(`${API_BASE_URL}/api/utenti/${id}`);
  }
}
