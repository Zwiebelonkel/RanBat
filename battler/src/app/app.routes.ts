import { Routes } from '@angular/router';
import { GeneratorPage } from './pages/generator/generator.page';
import { ArenaPage } from './pages/arena/arena.page';
import { CollectionPage } from './pages/collection/collection.page';
import { ShopPage } from './pages/shop/shop.page';

export const routes: Routes = [
  { path: '', redirectTo: 'generator', pathMatch: 'full' },
  { path: 'generator', loadComponent: () => Promise.resolve(GeneratorPage) },
  { path: 'arena', loadComponent: () => Promise.resolve(ArenaPage) },
  { path: 'collection', loadComponent: () => Promise.resolve(CollectionPage) },
  { path: 'shop', loadComponent: () => Promise.resolve(ShopPage) },
];
