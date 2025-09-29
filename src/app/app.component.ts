import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';

interface Utente {
  id: number;
  nome: string;
}

// In Angular Standalone Components, tutte le dipendenze devono essere importate
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  // Template HTML con layout Tailwind elegante e reattivo
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 flex items-start justify-center">
      
      <!-- Contenitore Principale -->
      <div class="w-full max-w-xl bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-6 sm:p-8 transition-all duration-300">
        <h1 class="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-6 border-b-2 border-indigo-200 pb-2">
          Gestione Collaboratori PWA
        </h1>

        <!-- Sezione Aggiungi Utente -->
        <form (ngSubmit)="aggiungiUtente()" class="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            [(ngModel)]="nuovoUtenteNome"
            name="nome"
            placeholder="Inserisci un nuovo Collaboratore"
            required
            class="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 dark:bg-gray-700 dark:text-white"
            style="font-family: 'Inter', sans-serif;"
          />
          <button
            type="submit"
            [disabled]="!nuovoUtenteNome"
            class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Aggiungi Utente
          </button>
        </form>

        <!-- Visualizzazione Stato -->
        <div *ngIf="caricamento()" class="text-center p-4">
          <svg class="animate-spin h-5 w-5 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Caricamento...</p>
        </div>

        <div *ngIf="errore()" class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
          <strong class="font-bold">Errore:</strong>
          <span class="block sm:inline"> Impossibile caricare gli utenti. Verifica la connessione API o il Backend.</span>
          <button (click)="caricaUtenti()" class="ml-4 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Ricarica</button>
        </div>

        <div *ngIf="!errore() && !caricamento()">
          <!-- Titolo Lista -->
          <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Lista Collaboratori ({{utenti().length}})
          </h2>

          <!-- Lista Utenti -->
          <ul *ngIf="utenti().length > 0; else noUsers" class="space-y-3">
            <li *ngFor="let utente of utenti()"
              class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition duration-150"
            >
              <span class="text-gray-800 dark:text-gray-100 font-medium truncate">{{ utente.nome }} (ID: {{ utente.id }})</span>
              <button
                (click)="eliminaUtente(utente.id)"
                class="ml-4 text-red-500 hover:text-red-700 transition duration-150 p-2 rounded-full hover:bg-red-100 dark:hover:bg-gray-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </li>
          </ul>

          <!-- Template Nessun Utente -->
          <ng-template #noUsers>
            <p class="text-center text-gray-500 dark:text-gray-400 p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              Nessun utente trovato. Aggiungine uno sopra!
            </p>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  // Rimosso styleUrls: ['./app.component.css'] in quanto usiamo solo Tailwind inline
})
export class AppComponent implements OnInit {
  // Dichiarazione dello stato con Signals
  utenti = signal<Utente[]>([]);
  caricamento = signal(false);
  errore = signal(false);
  nuovoUtenteNome: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.caricaUtenti();
  }

  // Metodo per caricare gli utenti dall'API
  caricaUtenti(): void {
    this.caricamento.set(true);
    this.errore.set(false);
    this.apiService.getUtenti().subscribe({
      next: (data) => {
        // La nostra API restituisce gli utenti in un campo 'utenti'
        this.utenti.set(data);
        this.caricamento.set(false);
      },
      error: (err) => {
        console.error('Errore durante il caricamento degli utenti:', err);
        this.errore.set(true);
        this.caricamento.set(false);
      },
    });
  }

  // Metodo per aggiungere un nuovo utente
  aggiungiUtente(): void {
    if (!this.nuovoUtenteNome) return;

    this.apiService.addUtente({ nome: this.nuovoUtenteNome }).subscribe({
      next: () => {
        // In caso di successo, ricarica la lista
        this.nuovoUtenteNome = '';
        this.caricaUtenti();
      },
      error: (err) => {
        console.error("Errore nell'aggiunta dell'utente:", err);
        // Potresti mostrare un messaggio di errore specifico qui
      },
    });
  }

  // Metodo per eliminare un utente
  eliminaUtente(id: number): void {
    if (confirm(`Sei sicuro di voler eliminare l'utente con ID: ${id}?`)) {
      this.apiService.deleteUtente(id).subscribe({
        next: () => {
          // In caso di successo, ricarica la lista
          this.caricaUtenti();
        },
        error: (err) => {
          console.error("Errore nell'eliminazione dell'utente:", err);
          // Potresti mostrare un messaggio di errore specifico qui
        },
      });
    }
  }
}
