import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';

// Definizione dell'interfaccia per l'utente, allineata al Backend PostgreSQL in italiano
interface Utente {
  id: number;
  nome: string; // Corretto per il nome del campo nel DB
  data_creazione: string; // Corretto per il nome del campo nel DB
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, DatePipe],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div class="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-6 sm:p-10 border border-gray-100">

        <!-- Header -->
        <header class="text-center mb-10">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-indigo-700">Registro Collaboratori PWA</h1>
          <p class="text-sm sm:text-lg text-gray-500 mt-2">
            Applicazione Web Progressiva (PWA) con Angular e PostgreSQL.
          </p>
        </header>

        <!-- Form Inserimento Nuovo Utente -->
        <section class="bg-indigo-50 p-6 rounded-lg shadow-inner mb-8">
          <h2 class="text-xl font-semibold text-indigo-800 mb-4">Inserisci un nuovo Collaboratore</h2>
          <form (ngSubmit)="aggiungiUtente()" class="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              [(ngModel)]="nuovoNomeUtente" 
              name="nome" 
              placeholder="Nome completo..."
              required
              class="flex-grow p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            >
            <button 
              type="submit" 
              [disabled]="!nuovoNomeUtente.trim()"
              class="p-3 text-white font-bold rounded-lg shadow-md transition duration-300 
                     disabled:bg-indigo-300 disabled:cursor-not-allowed
                     bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
            >
              Aggiungi Utente
            </button>
          </form>
        </section>

        <!-- Sezione Errori e Messaggi -->
        <div *ngIf="erroreAggiunta || erroreEliminazione || erroreCaricamento" 
             class="p-4 mb-6 rounded-lg bg-red-100 border border-red-400 text-red-700">
          <p class="font-bold">Errore:</p>
          <p>{{ erroreAggiunta || erroreEliminazione || erroreCaricamento }}</p>
        </div>

        <!-- Lista Collaboratori -->
        <section>
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <h2 class="text-2xl font-semibold text-gray-700">
              Lista Collaboratori ({{ utenti.length }})
            </h2>
            <button 
              (click)="caricaUtenti()" 
              class="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150"
            >
              Ricarica
            </button>
          </div>

          <div *ngIf="utenti.length === 0" class="text-center p-8 bg-gray-50 rounded-lg border-dashed border-2 border-gray-300 text-gray-500">
            Nessun utente trovato. Aggiungine uno sopra!
          </div>

          <!-- Tabella Utenti -->
          <ul class="space-y-3">
            <li *ngFor="let utente of utenti" 
                class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-150 border border-gray-200">
              
              <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4 truncate">
                <span class="text-lg font-bold text-gray-800 truncate">
                  {{ utente.nome || '[NOME NON DISPONIBILE]' }}
                </span>
                <span class="text-sm text-gray-500">
                  ID: {{ utente.id }} | Aggiunto il {{ utente.data_creazione ? (utente.data_creazione | date: 'dd/MM/yyyy HH:mm' : undefined : 'it-IT') : 'N/D' }}
                </span>
              </div>
              
              <button 
                (click)="apriModaleConferma(utente)" 
                class="text-red-500 hover:text-red-700 p-2 rounded-full transition duration-150"
                title="Elimina Utente">
                <!-- Icona Cestino (SVG Lucide-React equivalent) -->
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </button>
            </li>
          </ul>
        </section>

      </div>
    </div>

    <!-- Modale di Conferma Eliminazione -->
    <div *ngIf="mostraModale" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Conferma Eliminazione</h3>
        <p class="text-gray-700 mb-6">
          Sei sicuro di voler eliminare l'utente 
          <strong class="text-indigo-600">{{ utenteDaEliminare?.nome || '[Nome mancante]' }}</strong> 
          (ID: {{ utenteDaEliminare?.id }})? Questa operazione è irreversibile.
        </p>
        <div class="flex justify-end gap-3">
          <button 
            (click)="mostraModale = false" 
            class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 font-medium"
          >
            Annulla
          </button>
          <button 
            (click)="confermaElimina()" 
            class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150 font-medium shadow-md"
          >
            Conferma Elimina
          </button>
        </div>
      </div>
    </div>
  `,
  // Aggiunto changeDetection per performance (anche se facoltativo)
  changeDetection: ChangeDetectionStrategy.OnPush, 
  styleUrls: ['./app.component.css'],
  providers: [DatePipe] // Fornisce DatePipe per la formattazione
})
export class AppComponent implements OnInit {
  utenti: Utente[] = [];
  nuovoNomeUtente: string = '';
  erroreAggiunta: string = '';
  erroreEliminazione: string = '';
  erroreCaricamento: string = '';
  
  // Modale state
  mostraModale: boolean = false;
  utenteDaEliminare: Utente | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Inizializza il caricamento degli utenti all'avvio
    this.caricaUtenti();
  }

  caricaUtenti(): void {
    this.erroreCaricamento = ''; // Resetta l'errore prima di caricare
    this.apiService.getUtenti().subscribe({
      next: (data) => {
        // Mappa i dati in ingresso all'interfaccia Utente
        this.utenti = data.map(item => ({
          id: item.id,
          nome: item.nome, // Si aspetta il campo 'nome'
          data_creazione: item.data_creazione // Si aspetta il campo 'data_creazione'
        }));
        // Ordina gli utenti per ID (o data, se necessario)
        this.utenti.sort((a, b) => a.id - b.id);
      },
      error: (err) => {
        console.error('Errore durante il caricamento degli utenti:', err);
        this.erroreCaricamento = 'Impossibile caricare gli utenti. Verifica la connessione API o il Backend.';
        this.utenti = []; // Svuota la lista in caso di errore
      }
    });
  }

  aggiungiUtente(): void {
    if (!this.nuovoNomeUtente.trim()) {
      this.erroreAggiunta = 'Il nome non può essere vuoto.';
      return;
    }

    this.erroreAggiunta = ''; // Resetta l'errore
    
    // Il Backend si aspetta 'nome' e lo salva come 'nome' nel DB
    this.apiService.addUtente({ nome: this.nuovoNomeUtente }).subscribe({
      next: (nuovoUtente) => {
        this.nuovoNomeUtente = ''; // Pulisce l'input
        this.caricaUtenti(); // Ricarica la lista per vedere il nuovo utente
      },
      error: (err) => {
        console.error('Errore durante l\'aggiunta dell\'utente:', err);
        this.erroreAggiunta = `Errore durante l'aggiunta: ${err.message || 'Verifica il Backend.'}`;
      }
    });
  }

  // Logica Modale
  apriModaleConferma(utente: Utente): void {
    this.utenteDaEliminare = utente;
    this.mostraModale = true;
    this.erroreEliminazione = ''; // Resetta l'errore
  }

  confermaElimina(): void {
    if (this.utenteDaEliminare) {
      const id = this.utenteDaEliminare.id;
      this.mostraModale = false; // Chiude subito la modale

      this.apiService.deleteUtente(id).subscribe({
        next: () => {
          this.caricaUtenti(); // Ricarica la lista dopo l'eliminazione
        },
        error: (err) => {
          console.error('Errore durante l\'eliminazione:', err);
          this.erroreEliminazione = `Errore durante l'eliminazione: ${err.message || 'Verifica il Backend.'}`;
          this.caricaUtenti(); // Ricarica per vedere lo stato attuale
        }
      });
      this.utenteDaEliminare = null;
    }
  }
}
