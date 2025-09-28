import { Component, OnInit, signal, computed, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

// Definizione dell'interfaccia Utente
export interface Utente {
  id: number;
  name: string;
  created_at: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- HTML del Componente -->
    <div class="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-100 dark:bg-gray-900 font-inter">

      <!-- Contenitore Principale e Header -->
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 md:p-8">

        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Registro Collaboratori PWA
        </h1>
        <p class="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
          Applicazione Web Progressiva (PWA) con Angular e PostgreSQL.
        </p>

        <!-- Area di Inserimento -->
        <div class="mb-8 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-inner">
          <label for="new-name" class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Inserisci un nuovo Collaboratore
          </label>
          <div class="flex flex-col sm:flex-row gap-3">
            <input
              id="new-name"
              type="text"
              [(ngModel)]="nomeUtente"
              placeholder="Nome del collaboratore..."
              class="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              (keydown.enter)="addUtente()"
            >
            <button
              (click)="addUtente()"
              [disabled]="!nomeUtente().trim() || isLoading()"
              class="px-6 py-3 text-white font-semibold rounded-lg shadow-md transition duration-300
                     bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900
                     focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              {{ isLoading() ? 'Aggiunta...' : 'Aggiungi Utente' }}
            </button>
          </div>
          @if (errorMessage()) {
            <p class="mt-2 text-red-500 text-sm font-medium">{{ errorMessage() }}</p>
          }
        </div>

        <!-- Sezione Lista Utenti -->
        <div class="flex justify-between items-center mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Lista Collaboratori ({{ utenti().length }})
          </h2>
          <button
            (click)="getUtenti()"
            [disabled]="isLoading()"
            class="p-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition duration-150 rounded-full
                   hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center"
            title="Ricarica i dati dal server"
          >
            <!-- Icona Ricarica SVG -->
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.057 4m2.68 1.5H21v-5m-7.9 12.7L10 18.3M10 18.3L8 16.3M10 18.3L12 16.3M13 14h6M4 14h6"></path>
            </svg>
            Ricarica
          </button>
        </div>

        <!-- Stampa della Lista -->
        @if (isLoading() && utenti().length === 0) {
          <div class="text-center p-6 text-gray-500 dark:text-gray-400">Caricamento in corso...</div>
        } @else if (utenti().length === 0) {
          <div class="text-center p-6 text-gray-500 dark:text-gray-400">
            Nessun utente trovato. Aggiungine uno sopra!
          </div>
        } @else {
          <ul class="space-y-3">
            @for (utente of utenti(); track utente.id) {
              <li class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition duration-200">
                <div class="flex flex-col">
                  <span class="text-lg font-medium text-gray-900 dark:text-white">{{ utente.name }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">ID: {{ utente.id }} | Aggiunto il {{ formatDate(utente.created_at) }}</span>
                </div>
                <!-- Pulsante Elimina -->
                <button
                  (click)="confirmDelete(utente)"
                  class="ml-4 p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-gray-600 rounded-full transition duration-150"
                  title="Elimina questo utente"
                >
                  <!-- Icona Cestino SVG -->
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </li>
            }
          </ul>
        }
      </div>
    </div>
    
    <!-- Modale di Conferma Eliminazione -->
    @if (userToDelete()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl max-w-sm w-full">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Conferma Eliminazione</h3>
          <p class="text-gray-700 dark:text-gray-300 mb-6">
            Sei sicuro di voler eliminare l'utente <strong>{{ userToDelete().name }}</strong> (ID: {{ userToDelete().id }})? Questa operazione è irreversibile.
          </p>
          <div class="flex justify-end gap-3">
            <button
              (click)="cancelDelete()"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
            >
              Annulla
            </button>
            <button
              (click)="deleteUtente(userToDelete().id)"
              [disabled]="isLoading()"
              class="px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-300
                     bg-red-600 hover:bg-red-700 disabled:bg-red-300 focus:outline-none focus:ring-4 focus:ring-red-500/50"
            >
              {{ isLoading() ? 'Eliminazione...' : 'Conferma Elimina' }}
            </button>
          </div>
        </div>
      </div>
    }

  `,
  styles: [
    `
      /* Stili generali */
      :host {
        display: block;
        min-height: 100vh;
      }
      .font-inter {
        font-family: 'Inter', sans-serif;
      }
    `,
  ],
})
export class App {
  private apiService = inject(ApiService);

  // Stato dell'applicazione con Signals
  utenti: WritableSignal<Utente[]> = signal([]);
  nomeUtente: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);
  errorMessage: WritableSignal<string | null> = signal(null);

  // Segnale per la gestione della modale di conferma
  userToDelete: WritableSignal<Utente | null> = signal(null);

  constructor() {
    // Carica gli utenti immediatamente all'avvio del componente
    this.getUtenti();
  }

  // Metodo per recuperare gli utenti (GET)
  getUtenti() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.apiService.getUtenti().subscribe({
      next: (data) => {
        this.utenti.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Errore nel recupero degli utenti:', error);
        this.errorMessage.set('Impossibile caricare gli utenti. Controlla la console.');
        this.isLoading.set(false);
      },
    });
  }

  // Metodo per aggiungere un nuovo utente (POST)
  addUtente() {
    const name = this.nomeUtente().trim();
    if (!name) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.apiService.addUtente(name).subscribe({
      next: (newUser) => {
        // Aggiunge il nuovo utente all'inizio della lista locale
        this.utenti.update(users => [newUser, ...users]);
        this.nomeUtente.set(''); // Resetta il campo di input
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Errore nell\'aggiunta dell\'utente:', error);
        this.errorMessage.set('Errore durante l\'aggiunta: ' + (error.error?.error || 'Verifica il Backend.'));
        this.isLoading.set(false);
      },
    });
  }
  
  // Funzione per mostrare la modale di conferma (prepara l'utente da eliminare)
  confirmDelete(utente: Utente) {
    this.userToDelete.set(utente);
  }

  // Funzione per chiudere la modale
  cancelDelete() {
    this.userToDelete.set(null);
  }

  // NUOVO Metodo per eliminare un utente (DELETE)
  deleteUtente(id: number) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.apiService.deleteUtente(id).subscribe({
      next: () => {
        // Rimuove l'utente dalla lista locale
        this.utenti.update(users => users.filter(u => u.id !== id));
        this.userToDelete.set(null); // Chiude la modale
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Errore nell\'eliminazione dell\'utente:', error);
        this.errorMessage.set('Errore durante l\'eliminazione: ' + (error.error?.error || 'Verifica il Backend.'));
        this.userToDelete.set(null);
        this.isLoading.set(false);
      },
    });
  }

  // Formatta la data per una visualizzazione più pulita
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT') + ' ' + date.toLocaleTimeString('it-IT');
  }
}