import { Component, signal } from '@angular/core';
import { API_URL } from './core/config';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

interface PokemonApiResult { name: string; url: string; }

interface PokemonDetails {
  id: number;
  name: string;
  sprites: { other?: { 'official-artwork'?: { front_default: string | null } } };
  types: { type: { name: string } }[];
}

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly pokemon = signal<Pokemon[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly hasError = signal(false);

  constructor() {
    void this.loadPokemon();
  }

  protected async loadPokemon(): Promise<void> {
    this.isLoading.set(true);
    this.hasError.set(false);

    try {
      const response = await fetch(`${API_URL}/pokemon?limit=6&offset=0`);
      if (!response.ok) throw new Error('Could not load Pokemon');
      const list = (await response.json()) as { results: PokemonApiResult[] };
      const details = await Promise.all(
        list.results.map((item) => fetch(item.url).then((result) => result.json() as Promise<PokemonDetails>)),
      );

      this.pokemon.set(details.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.sprites.other?.['official-artwork']?.front_default ?? '',
        types: item.types.map(({ type }) => type.name),
      })));
    } catch {
      this.hasError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }
}
