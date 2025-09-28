import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaccia per definire la struttura dei dati che arrivano/vanno all'API
interface Utente {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL ASSOLUTO della tua API su Render
  private apiUrl = 'https://test-api-utenti.onrender.com/api/utenti'; 

  constructor(private http: HttpClient) { }

  /**
   * Chiama l'endpoint GET /api/utenti per recuperare tutti gli utenti.
   * Restituisce un Observable di un array di Utenti.
   */
  getUtenti(): Observable<Utente[]> {
    return this.http.get<Utente[]>(this.apiUrl);
  }

  /**
   * Chiama l'endpoint POST /api/utenti per aggiungere un nuovo utente.
   * @param nome Nuovo nome da aggiungere.
   * Restituisce l'Observable dell'utente appena creato (o un oggetto di conferma).
   */
  addUser(nome: string): Observable<any> {
    // Invia il nome nel corpo della richiesta POST come JSON: { "nome": "NuovoNome" }
    return this.http.post(this.apiUrl, { nome });
  }
}
