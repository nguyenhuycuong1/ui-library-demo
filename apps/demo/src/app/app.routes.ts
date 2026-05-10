import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'foundations',
    pathMatch: 'full',
  },
  {
    path: 'foundations',
    loadComponent: () =>
      import('./pages/foundations/foundations.component').then(m => m.FoundationsComponent),
  },
  {
    path: 'components',
    loadComponent: () =>
      import('./pages/components-demo/components-demo.component').then(m => m.ComponentsDemoComponent),
  },
  {
    path: 'overlay',
    loadComponent: () =>
      import('./pages/overlay-demo/overlay-demo.component').then(m => m.OverlayDemoComponent),
  },
  {
    path: 'grid',
    loadComponent: () =>
      import('./pages/grid-demo/grid-demo.component').then(m => m.GridDemoComponent),
  },
  {
    path: 'icons',
    loadComponent: () =>
      import('./pages/icon-demo/icon-demo.component').then(m => m.IconDemoComponent),
  },
  {
    path: 'pagination',
    loadComponent: () =>
      import('./pages/pagination-demo/pagination-demo.component').then(m => m.PaginationDemoComponent),
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./pages/tab-demo/tab-demo.component').then(m => m.TabDemoComponent),
  },
  {
    path: 'components-dev',
    loadComponent: () =>
      import('./pages/components-dev/dev.component').then(m => m.DevComponent),
  }
];
