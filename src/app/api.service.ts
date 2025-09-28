import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utente } from './app.component'; // Importa l'interfaccia

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  
  // *** HO AGGIUNTO /api/ nel percorso dell'API ***
  private apiUrl = 'https://test-api-utenti.onrender.com/api/utenti'; 

  // Metodo GET: Recupera tutti gli utenti
  getUtenti(): Observable<Utente[]> {
    return this.http.get<Utente[]>(this.apiUrl);
  }

  // Metodo POST: Aggiunge un nuovo utente
  addUtente(name: string): Observable<Utente> {
    return this.http.post<Utente>(this.apiUrl, { name });
  }

  // NUOVO Metodo DELETE: Rimuove un utente
  deleteUtente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
