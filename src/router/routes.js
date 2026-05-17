const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'games', name: 'games', component: () => import('pages/GamesPage.vue') },
      { path: 'letter-click', name: 'letter-click', component: () => import('pages/LetterClickPage.vue') },
      { path: 'what-is-missing', name: 'what-is-missing', component: () => import('pages/WhatIsMissingPage.vue') },
      { path: 'react-click', name: 'react-click', component: () => import('pages/ReactClickPage.vue') },
      { path: 'results', name: 'results', component: () => import('pages/ResultsPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
