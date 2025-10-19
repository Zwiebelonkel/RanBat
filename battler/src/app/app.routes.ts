import { Routes } from '@angular/router';
import { GeneratorPage } from './pages/generator/generator.page';
import { ArenaPage } from './pages/arena/arena.page';
import { CollectionPage } from './pages/collection/collection.page';
import { LoginComponent } from './components/login/login.component';
import { ShopPage } from './pages/shop/shop.page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => Promise.resolve(LoginComponent) },
  { path: 'generator', loadComponent: () => Promise.resolve(GeneratorPage) },
  { path: 'arena', loadComponent: () => Promise.resolve(ArenaPage) },
  { path: 'collection', loadComponent: () => Promise.resolve(CollectionPage) },
  { path: 'shop', loadComponent: () => Promise.resolve(ShopPage) },
];
