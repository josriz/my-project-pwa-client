import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- NECESSARIO PER [(ngModel)]
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service'; 

// Interfaccia per l'utente (deve corrispondere alla struttura dell'API)
interface Utente {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule], // <-- AGGIUNGI FormsModule QUI
  templateUrl: './app.component.html', 
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Connessione PWA API Render';
  utenti: Utente[] = []; 
  caricamentoCompletato = false;
  errore: string | null = null;
  
  // Variabile per il campo di input nel template
  nuovoNome: string = '';
  messaggioStato: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Carica gli utenti all'avvio
    this.caricaUtenti();
  }

  // Funzione per caricare gli utenti (riutilizzabile dopo l'inserimento)
  caricaUtenti(): void {
    this.caricamentoCompletato = false;
    this.errore = null;
    this.messaggioStato = 'Caricamento dati...';

    this.apiService.getUtenti().subscribe({
      next: (data) => {
        this.utenti = data; 
        this.caricamentoCompletato = true;
        this.messaggioStato = 'Dati caricati.';
      },
      error: (err) => {
        this.errore = 'Errore di connessione API: ' + err.message;
        this.caricamentoCompletato = true;
        this.messaggioStato = null;
        console.error('API Error:', err);
      }
    });
  }

  // Funzione per inviare il nuovo utente all'API (POST)
  aggiungiUtente(): void {
    if (!this.nuovoNome.trim()) {
      this.messaggioStato = 'Inserisci un nome valido.';
      return;
    }

    this.messaggioStato = `Invio ${this.nuovoNome} all'API...`;

    this.apiService.addUser(this.nuovoNome).subscribe({
      next: (risposta) => {
        // Pulizia e notifica
        this.messaggioStato = `Utente '${this.nuovoNome}' aggiunto con successo! (ID: ${risposta.id})`;
        this.nuovoNome = ''; 
        // Ricarica la lista per vedere il nuovo utente
        this.caricaUtenti(); 
      },
      error: (err) => {
        this.messaggioStato = `ERRORE nell'aggiunta: ${err.message}`;
        console.error('Add User API Error:', err);
      }
    });
  }
}
