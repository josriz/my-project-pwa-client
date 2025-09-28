import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utente } from './app.component'; // Importa l'interfaccia (Definita in app.component.ts)

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  // CRUCIALE: Percorso relativo corretto che Render reindirizza al Backend
  // Abbiamo rimosso l'URL completo per usare il reindirizzamento di Render
  private apiUrl = '/api/utenti';

  /**
   * Recupera tutti gli utenti dal Backend.
   * @returns Un Observable di array di Utente.
   */
  getUtenti(): Observable<Utente[]> {
    return this.http.get<Utente[]>(this.apiUrl);
  }

  /**
   * Aggiunge un nuovo utente al Backend.
   * @param name Il nome del nuovo utente.
   * @returns Un Observable dell'Utente appena creato.
   */
  addUtente(name: string): Observable<Utente> {
    return this.http.post<Utente>(this.apiUrl, { name });
  }

  /**
   * Elimina un utente per ID dal Backend.
   * @param id L'ID numerico dell'utente da eliminare.
   * @returns Un Observable vuoto (void) in caso di successo.
   */
  deleteUtente(id: number): Observable<void> {
    // Nota l'uso del template literal per aggiungere l'ID alla fine dell'URL
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}